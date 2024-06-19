const { Orders, Device, Payment } = require("../models/models");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const path = require("path");
const axios = require("axios");

const CURRENCIES = {
  AMD: "051",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SERVICE_EMAIL,
    pass: process.env.SERVICE_PASSWORD,
  },
});

class OrdersController {
  async create(req, res) {
    try {
      let {
        devices,
        total,
        name,
        surname,
        phone,
        email,
        message,
        address,
        region,
        payment,
        delivery,
        currency,
        returnUrl,
        failUrl,
      } = req.body;
      let { language } = req.query;
      message = message || "";
      devices = JSON.parse(devices);

      if (language == "am") {
        language = "hy";
      }

      let currentDevices = await Device.findAll({
        where: {
          id: {
            [Op.in]: devices.map((device) => device.id),
          },
        },
      });

      if (
        currentDevices?.find(
          (device) =>
            device.quantity < devices.find((d) => d.id === device.id)?.count
        )
      ) {
        return res.status(409).json({ success: false });
      }

      if (payment === "online") {
        const orderNumber = Math.floor(Date.now() * Math.random());

        let { data: paymentResponse } = await axios.post(
          "https://ipay.arca.am/payment/rest/register.do",
          {},
          {
            params: {
              userName: process.env.PAYMENT_USERNAME,
              password: process.env.PAYMENT_PASSWORD,
              amount: `${total}00`,
              currency: CURRENCIES[currency],
              returnUrl,
              failUrl,
              orderNumber,
              language,
            },
          }
        );

        if (paymentResponse.errorCode) {
          return res.status(400).json({
            success: false,
            message: paymentResponse.errorMessage,
          });
        }

        const order = await Orders.create({
          devices: JSON.stringify(devices),
          total,
          name,
          surname,
          phone,
          email,
          message,
          address,
          region,
          payment,
          delivery,
        });

        await Payment.create({
          orderId: order.id,
          orderKey: paymentResponse.orderId,
          orderNumber,
        });

        return res.json({ success: true, formUrl: paymentResponse.formUrl });
      } else if (payment === "cash") {
        await Orders.create({
          devices: JSON.stringify(devices),
          total,
          name,
          surname,
          phone,
          email,
          message,
          address,
          region,
          payment,
          delivery,
          status: "pending",
        });

        devices.map((device) => {
          Device.decrement("quantity", {
            by: device.count,
            where: { id: device.id },
          });
        });

        const mailOptions = {
          from: process.env.SERVICE_EMAIL,
          to: `${email}`,
          subject: "Your order has completed successfully!",
          html: `
          <div style="width: 100%; height: 550px; background: #12222d; padding-top: 30px; text-align: center">
    <img src="cid:order" alt="" width="150" height="150">
    <h1 style="color: #F4B41A">Your order has completed successfully!</h1>
    <h3 style="color: white; margin-bottom: 30px">Dear ${name}!<br>
    Your order is pending.
   </h3>
   <div style="width: 80%; background: grey; height: 1px; margin: 0 auto 20px"></div>
   <img
     style="margin: 0 auto 50px"
     src="cid:logo"
     width="50"
     height="60"
     alt=""/>
    <div style="margin: 0 auto;width: 400px">
    <div style="width: fit-content; display: flex;margin: 0 auto 10px;">
     <img src="cid:phone" height="24" width="24" style="margin-right: 10px">
      <span style="color: white; text-align: left;margin-top: 3px">+ (374) 55 49 19 89</span>
    </div>
     <div style="width: fit-content; display: flex;margin: 0 auto;">
     <img src="cid:marker" height="24" width="24" style="margin-right: 10px">
      <span style="color: white; text-align: left;margin-top: 3px">45 Nairyan St Sevan, Armenia</span>
    </div></div>
   </div>`,
          attachments: [
            {
              filename: "order.png",
              path: path.resolve(__dirname, "..", "public", "order.png"),
              cid: "order",
            },
            {
              filename: "phone.png",
              path: path.resolve(__dirname, "..", "public", "phone.png"),
              cid: "phone",
            },
            {
              filename: "logo.png",
              path: path.resolve(__dirname, "..", "public", "logo.png"),
              cid: "logo",
            },
            {
              filename: "marker.png",
              path: path.resolve(__dirname, "..", "public", "marker.png"),
              cid: "marker",
            },
          ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email successfully sent");
          }
        });

        return res.json({ success: true, formUrl: returnUrl });
      } else if (payment === "Idram") {
        const orderNumber = Math.floor(Date.now() * Math.random());

        const order = await Orders.create({
          devices: JSON.stringify(devices),
          total,
          name,
          surname,
          phone,
          email,
          message,
          address,
          region,
          payment,
          delivery,
        });

        await Payment.create({
          orderId: order.id,
          orderKey: paymentResponse.orderId,
          orderNumber,
        });

        return res.json({ success: true, billId: orderNumber });
      }
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async finish(req, res) {
    try {
      const { orderKey } = req.body;

      if (!orderKey) {
        return res.status(400).json({
          success: false,
          message: "INVALID ORDER KEY",
        });
      }

      const payment = await Payment.findOne({
        where: {
          orderKey,
          status: "pending",
        },
      });

      if (!payment) {
        return res.status(400).json({
          success: false,
          message: "INVALID ORDER KEY",
        });
      }

      const { data: paymentResponse } = await axios.post(
        `https://ipay.arca.am/payment/rest/getOrderStatus.do`,
        {},
        {
          params: {
            userName: process.env.PAYMENT_USERNAME,
            password: process.env.PAYMENT_PASSWORD,
            orderId: orderKey,
            language: "en",
          },
        }
      );

      payment.status = paymentResponse.errorMessage;

      payment.save();

      if (paymentResponse.error && paymentResponse.orderStatus !== 2)
        return res.json({
          success: false,
          message: paymentResponse.errorMessage,
        });

      const order = await Orders.findByPk(payment.orderId);

      const devices = JSON.parse(order.devices);
      order.status = "pending";

      devices.map((device) => {
        Device.decrement("quantity", {
          by: device.count,
          where: { id: device.id },
        });
      });

      await order.save();

      const mailOptions = {
        from: process.env.SERVICE_EMAIL,
        to: `${order.email}`,
        subject: "Your order has completed successfully!",
        html: `
        <div style="width: 100%; height: 550px; background: #12222d; padding-top: 30px; text-align: center">
  <img src="cid:order" alt="" width="150" height="150">
  <h1 style="color: #F4B41A">Your order has completed successfully!</h1>
  <h3 style="color: white; margin-bottom: 30px">Dear ${order.name}!<br>
  Your order is pending.
 </h3>
 <div style="width: 80%; background: grey; height: 1px; margin: 0 auto 20px"></div>
 <img
   style="margin: 0 auto 50px"
   src="cid:logo"
   width="50"
   height="60"
   alt=""/>
  <div style="margin: 0 auto;width: 400px">
  <div style="width: fit-content; display: flex;margin: 0 auto 10px;">
   <img src="cid:phone" height="24" width="24" style="margin-right: 10px">
    <span style="color: white; text-align: left;margin-top: 3px">+ (374) 55 49 19 89</span>
  </div>
   <div style="width: fit-content; display: flex;margin: 0 auto;">
   <img src="cid:marker" height="24" width="24" style="margin-right: 10px">
    <span style="color: white; text-align: left;margin-top: 3px">45 Nairyan St Sevan, Armenia</span>
  </div></div>
 </div>`,
        attachments: [
          {
            filename: "order.png",
            path: path.resolve(__dirname, "..", "public", "order.png"),
            cid: "order",
          },
          {
            filename: "phone.png",
            path: path.resolve(__dirname, "..", "public", "phone.png"),
            cid: "phone",
          },
          {
            filename: "logo.png",
            path: path.resolve(__dirname, "..", "public", "logo.png"),
            cid: "logo",
          },
          {
            filename: "marker.png",
            path: path.resolve(__dirname, "..", "public", "marker.png"),
            cid: "marker",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email successfully sent");
        }
      });

      return res.send({ success: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async finishIdram(req, res) {
    const SECRET_KEY = process.env.IDRAM_PASSWORD;
    const EDP_REC_ACCOUNT = process.env.IDRAM_ID;
    const request = req.body;
    const billId = request.EDP_BILL_NO;

    try {
      if (
        typeof request.EDP_PRECHECK !== "undefined" &&
        typeof request.EDP_BILL_NO !== "undefined" &&
        typeof request.EDP_REC_ACCOUNT !== "undefined" &&
        typeof request.EDP_AMOUNT !== "undefined"
      ) {
        if (request.EDP_PRECHECK === "YES") {
          if (request.EDP_REC_ACCOUNT === EDP_REC_ACCOUNT) {
            res.send("OK");
          }
        }
      }

      if (
        typeof request.EDP_PAYER_ACCOUNT !== "undefined" &&
        typeof request.EDP_BILL_NO !== "undefined" &&
        typeof request.EDP_REC_ACCOUNT !== "undefined" &&
        typeof request.EDP_AMOUNT !== "undefined" &&
        typeof request.EDP_TRANS_ID !== "undefined" &&
        typeof request.EDP_CHECKSUM !== "undefined"
      ) {
        const txtToHash =
          EDP_REC_ACCOUNT +
          ":" +
          request.EDP_AMOUNT +
          ":" +
          SECRET_KEY +
          ":" +
          request.EDP_BILL_NO +
          ":" +
          request.EDP_PAYER_ACCOUNT +
          ":" +
          request.EDP_TRANS_ID +
          ":" +
          request.EDP_TRANS_DATE;
        if (
          request.EDP_CHECKSUM.toUpperCase() !==
          CryptoJS.MD5(txtToHash).toString().toUpperCase()
        ) {
          res.send("Error");
        } else {
          const payment = await Payment.findOne({
            where: { orderNumber: billId },
          });
          if (!payment) {
            return res
              .status(400)
              .json({ success: false, message: "Payment not found" });
          }
          await Orders.update(
            {
              where: {
                id: payment.orderId,
              },
            },
            {
              status: "pending",
            }
          );
          return res.send("OK");
        }
      }
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const orders = await Orders.findAll({
        where: {
          status: {
            [Op.not]: "unfinished",
          },
        },
        order: [["id", "DESC"]],
      });
      return res.send(orders);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const order = await Orders.findOne({
        where: { id },
      });
      return res.json(order);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      await Orders.destroy({
        where: { id },
      });
      return res.json({ succes: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async updateOne(req, res) {
    try {
      const { status, name, email } = req.body;
      const { id } = req.params;
      await Orders.update(
        {
          status,
        },
        {
          where: { id },
        }
      );
      let mailOptions;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SERVICE_EMAIL,
          pass: process.env.SERVICE_PASSWORD,
        },
      });
      switch (status) {
        case "processing":
          mailOptions = {
            from: process.env.SERVICE_EMAIL,
            to: `${email}`,
            subject: "Your order is on the way!",
            html: `
            <div style="width: 100%; height: 570px; background: #12222d; padding-top: 30px; text-align: center">
      <img src="cid:order" alt="" width="150" height="150">
      <h1 style="color: #F4B41A">Your order is on the way!</h1>
      <h3 style="color: white; margin-bottom: 30px">Dear ${name}!<br>
Your order is on the way. <br> After few days You can get it.
     </h3>
     <div style="width: 80%; background: grey; height: 1px; margin: 0 auto 20px"></div>
     <img
       style="margin: 0 auto 50px"
       src="cid:logo"
       width="50"
       height="60"
       alt=""/>
      <div style="margin: 0 auto;width: 400px">
      <div style="width: fit-content; display: flex;margin: 0 auto 10px;">
       <img src="cid:phone" height="24" width="24" style="margin-right: 10px">
        <span style="color: white; text-align: left;margin-top: 3px">+ (374) 55 49 19 89</span>
      </div>
       <div style="width: fit-content; display: flex;margin: 0 auto;">
       <img src="cid:marker" height="24" width="24" style="margin-right: 10px">
        <span style="color: white; text-align: left;margin-top: 3px">45 Nairyan St Sevan, Armenia</span>
      </div></div>
     </div>`,
            attachments: [
              {
                filename: "order.png",
                path: path.resolve(__dirname, "..", "public", "order.png"),
                cid: "order",
              },
              {
                filename: "phone.png",
                path: path.resolve(__dirname, "..", "public", "phone.png"),
                cid: "phone",
              },
              {
                filename: "logo.png",
                path: path.resolve(__dirname, "..", "public", "logo.png"),
                cid: "logo",
              },
              {
                filename: "marker.png",
                path: path.resolve(__dirname, "..", "public", "marker.png"),
                cid: "marker",
              },
            ],
          };
          break;
        case "delivered":
          mailOptions = {
            from: process.env.SERVICE_EMAIL,
            to: `${email}`,
            subject: "Your order is delivered!",
            html: `
            <div style="width: 100%; height: 570px; background: #12222d; padding-top: 30px; text-align: center">
      <img src="cid:order" alt="" width="150" height="150">
      <h1 style="color: #F4B41A">Your order is delivered!</h1>
      <h3 style="color: white; margin-bottom: 30px">Dear ${name}!<br>
      We know you can't wait for your package to arrive.
     </h3>
     <div style="width: 80%; background: grey; height: 1px; margin: 0 auto 20px"></div>
     <img
       style="margin: 0 auto 50px"
       src="cid:logo"
       width="50"
       height="60"
       alt=""/>
      <div style="margin: 0 auto;width: 400px">
      <div style="width: fit-content; display: flex;margin: 0 auto 10px;">
       <img src="cid:phone" height="24" width="24" style="margin-right: 10px">
        <span style="color: white; text-align: left;margin-top: 3px">+ (374) 55 49 19 89</span>
      </div>
       <div style="width: fit-content; display: flex;margin: 0 auto;">
       <img src="cid:marker" height="24" width="24" style="margin-right: 10px">
        <span style="color: white; text-align: left;margin-top: 3px">45 Nairyan St Sevan, Armenia</span>
      </div></div>
     </div>`,
            attachments: [
              {
                filename: "order.png",
                path: path.resolve(__dirname, "..", "public", "order.png"),
                cid: "order",
              },
              {
                filename: "phone.png",
                path: path.resolve(__dirname, "..", "public", "phone.png"),
                cid: "phone",
              },
              {
                filename: "logo.png",
                path: path.resolve(__dirname, "..", "public", "logo.png"),
                cid: "logo",
              },
              {
                filename: "marker.png",
                path: path.resolve(__dirname, "..", "public", "marker.png"),
                cid: "marker",
              },
            ],
          };
          break;
        case "picked":
          mailOptions = {
            from: process.env.SERVICE_EMAIL,
            to: `${email}`,
            subject: "Your order is now in your hands!",
            html: `
            <div style="width: 100%; height: 570px; background: #12222d; padding-top: 30px; text-align: center">
      <img src="cid:order" alt="" width="150" height="150">
      <h1 style="color: #F4B41A">Your order is now in your hands!</h1>
      <h3 style="color: white; margin-bottom: 30px">Dear ${name}!<br>
      You have successfully received your order. <br> Thank you for choosing us.
     </h3>
     <div style="width: 80%; background: grey; height: 1px; margin: 0 auto 20px"></div>
     <img
       style="margin: 0 auto 50px"
       src="cid:logo"
       width="50"
       height="60"
       alt=""/>
      <div style="margin: 0 auto;width: 400px">
      <div style="width: fit-content; display: flex;margin: 0 auto 10px;">
       <img src="cid:phone" height="24" width="24" style="margin-right: 10px">
        <span style="color: white; text-align: left;margin-top: 3px">+ (374) 55 49 19 89</span>
      </div>
       <div style="width: fit-content; display: flex;margin: 0 auto;">
       <img src="cid:marker" height="24" width="24" style="margin-right: 10px">
        <span style="color: white; text-align: left;margin-top: 3px">45 Nairyan St Sevan, Armenia</span>
      </div></div>
     </div>`,
            attachments: [
              {
                filename: "order.png",
                path: path.resolve(__dirname, "..", "public", "order.png"),
                cid: "order",
              },
              {
                filename: "phone.png",
                path: path.resolve(__dirname, "..", "public", "phone.png"),
                cid: "phone",
              },
              {
                filename: "logo.png",
                path: path.resolve(__dirname, "..", "public", "logo.png"),
                cid: "logo",
              },
              {
                filename: "marker.png",
                path: path.resolve(__dirname, "..", "public", "marker.png"),
                cid: "marker",
              },
            ],
          };
          break;
        default:
          break;
      }
      if (status !== "pending") {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email successfully sent");
          }
        });
      }
      return res.json({ succes: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new OrdersController();

const { Orders, Device } = require('../models/models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const path = require('path');

class OrdersController {
  async create(req, res) {
    try {
      let { devices, name, surname, phone, email, message, address, region, payment, delivery } =
        req.body;
      message = message || '';
      devices = JSON.parse(devices);
      let currentDevices = await Device.findAll({
        where: {
          id: {
            [Op.in]: devices.map((device) => device.id),
          },
        },
      });
      if (
        currentDevices?.find(
          (device) => device.quantity < devices.find((d) => d.id === device.id)?.count,
        )
      ) {
        return res.status(409).json({ success: false });
      }
      const order = await Orders.create({
        devices: JSON.stringify(devices),
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
      devices.map((device) => {
        Device.decrement('quantity', { by: device.count, where: { id: device.id } });
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 't37378844@gmail.com',
          pass: 'mliwqgdownkuesms',
        },
      });

      const mailOptions = {
        from: 't37378844@gmail.com',
        to: `${email}`,
        subject: 'Dear ' + name + '!',
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
    <span style="color: white; text-align: left;margin-top: 3px">+ (374) 91 75 19 00</span>
  </div>
   <div style="width: fit-content; display: flex;margin: 0 auto;">
   <img src="cid:marker" height="24" width="24" style="margin-right: 10px">
    <span style="color: white; text-align: left;margin-top: 3px">39 Nairyan St Sevan, Armenia</span>
  </div></div>
 </div>`,
        attachments: [
          {
            filename: 'order.png',
            path: path.resolve(__dirname, '..', 'public', 'order.png'),
            cid: 'order',
          },
          {
            filename: 'phone.png',
            path: path.resolve(__dirname, '..', 'public', 'phone.png'),
            cid: 'phone',
          },
          {
            filename: 'logo.png',
            path: path.resolve(__dirname, '..', 'public', 'logo.png'),
            cid: 'logo',
          },
          {
            filename: 'marker.png',
            path: path.resolve(__dirname, '..', 'public', 'marker.png'),
            cid: 'marker',
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email successfully sent');
        }
      });
      res.send({ success: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const orders = await Orders.findAll();
      res.send(orders);
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
      const order = await Orders.destroy({
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
      const order = await Orders.update(
        {
          status,
        },
        {
          where: { id },
        },
      );
      let mailOptions;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 't37378844@gmail.com',
          pass: 'mliwqgdownkuesms',
        },
      });
      switch (status) {
        case 'processing':
          mailOptions = {
            from: 't37378844@gmail.com',
            to: `${email}`,
            subject: 'Dear ' + name + '!',
            html: `
            <div style="width: 100%; height: 550px; background: #12222d; padding-top: 30px; text-align: center">
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
        <span style="color: white; text-align: left;margin-top: 3px">+ (374) 91 75 19 00</span>
      </div>
       <div style="width: fit-content; display: flex;margin: 0 auto;">
       <img src="cid:marker" height="24" width="24" style="margin-right: 10px">
        <span style="color: white; text-align: left;margin-top: 3px">39 Nairyan St Sevan, Armenia</span>
      </div></div>
     </div>`,
            attachments: [
              {
                filename: 'order.png',
                path: path.resolve(__dirname, '..', 'public', 'order.png'),
                cid: 'order',
              },
              {
                filename: 'phone.png',
                path: path.resolve(__dirname, '..', 'public', 'phone.png'),
                cid: 'phone',
              },
              {
                filename: 'logo.png',
                path: path.resolve(__dirname, '..', 'public', 'logo.png'),
                cid: 'logo',
              },
              {
                filename: 'marker.png',
                path: path.resolve(__dirname, '..', 'public', 'marker.png'),
                cid: 'marker',
              },
            ],
          };
          break;
        case 'delivered':
          mailOptions = {
            from: 't37378844@gmail.com',
            to: `${email}`,
            subject: 'Dear ' + name + '!',
            html: `
            <div style="width: 100%; height: 550px; background: #12222d; padding-top: 30px; text-align: center">
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
        <span style="color: white; text-align: left;margin-top: 3px">+ (374) 91 75 19 00</span>
      </div>
       <div style="width: fit-content; display: flex;margin: 0 auto;">
       <img src="cid:marker" height="24" width="24" style="margin-right: 10px">
        <span style="color: white; text-align: left;margin-top: 3px">39 Nairyan St Sevan, Armenia</span>
      </div></div>
     </div>`,
            attachments: [
              {
                filename: 'order.png',
                path: path.resolve(__dirname, '..', 'public', 'order.png'),
                cid: 'order',
              },
              {
                filename: 'phone.png',
                path: path.resolve(__dirname, '..', 'public', 'phone.png'),
                cid: 'phone',
              },
              {
                filename: 'logo.png',
                path: path.resolve(__dirname, '..', 'public', 'logo.png'),
                cid: 'logo',
              },
              {
                filename: 'marker.png',
                path: path.resolve(__dirname, '..', 'public', 'marker.png'),
                cid: 'marker',
              },
            ],
          };
          break;
        //////////////////////////////////////////////////////////////////////////
        case 'picked':
          mailOptions = {
            from: 't37378844@gmail.com',
            to: `${email}`,
            subject: 'Dear ' + name + '!',
            html: `
            <div style="width: 100%; height: 550px; background: #12222d; padding-top: 30px; text-align: center">
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
        <span style="color: white; text-align: left;margin-top: 3px">+ (374) 91 75 19 00</span>
      </div>
       <div style="width: fit-content; display: flex;margin: 0 auto;">
       <img src="cid:marker" height="24" width="24" style="margin-right: 10px">
        <span style="color: white; text-align: left;margin-top: 3px">39 Nairyan St Sevan, Armenia</span>
      </div></div>
     </div>`,
            attachments: [
              {
                filename: 'order.png',
                path: path.resolve(__dirname, '..', 'public', 'order.png'),
                cid: 'order',
              },
              {
                filename: 'phone.png',
                path: path.resolve(__dirname, '..', 'public', 'phone.png'),
                cid: 'phone',
              },
              {
                filename: 'logo.png',
                path: path.resolve(__dirname, '..', 'public', 'logo.png'),
                cid: 'logo',
              },
              {
                filename: 'marker.png',
                path: path.resolve(__dirname, '..', 'public', 'marker.png'),
                cid: 'marker',
              },
            ],
          };
          break;
        default:
          break;
      }
      if (status !== 'pending') {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email successfully sent');
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

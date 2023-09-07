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
        <div style="width: 100%; height: 370px; background: #12222d; padding-top: 30px; text-align: center">
          <img src="cid:order" alt="" width="150" height="150">
          <h1 style="color: #F4B41A">Your order is pending!</h1>
          <h3 style="color: white">Dear ${name}!<br>
          Your order is pending. <br>After few days days You can get it
         </h3>
        </div>`,
        attachments: [
          {
            filename: 'order.png',
            path: path.resolve(__dirname, '..', 'public', 'order.png'),
            cid: 'order',
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
              <div style="width: 100%; height: 370px; background: #12222d; padding-top: 30px; text-align: center">
                <img src="cid:order" alt="" width="150" height="150">
                <h1 style="color: #F4B41A">Your order is on the way!</h1>
                <h3 style="color: white">Dear ${name}!<br>
                  Your ordrer is on the way. <br> After few days days You can get it
               </h3>
              </div>`,
            attachments: [
              {
                filename: 'order.png',
                path: path.resolve(__dirname, '..', 'public', 'order.png'),
                cid: 'order',
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
            <div style="width: 100%; height: 370px; background: #12222d; padding-top: 30px; text-align: center">
              <img src="cid:order" alt="" width="150" height="150">
              <h1 style="color: #F4B41A">Your order was delivered!</h1>
              <h3 style="color: white">Dear ${name}!<br>
                We know you can't wait for your <br> package to arrive. 
             </h3>
            </div>`,
            attachments: [
              {
                filename: 'order.png',
                path: path.resolve(__dirname, '..', 'public', 'order.png'),
                cid: 'order',
              },
            ],
          };
          break;
        default:
          mailOptions = {
            from: 't37378844@gmail.com',
            to: `${email}`,
            subject: 'Dear ' + name + '!',
            html: `
          <div style="width: 100%; height: 370px; background: #12222d; padding-top: 30px; text-align: center">
            <img src="cid:order" alt="" width="150" height="150">
            <h1 style="color: #F4B41A">Your order is pending!</h1>
            <h3 style="color: white">Dear ${name}!<br>
            Your order is pending. <br>After few days days You can get it
           </h3>
          </div>`,
            attachments: [
              {
                filename: 'order.png',
                path: path.resolve(__dirname, '..', 'public', 'order.png'),
                cid: 'order',
              },
            ],
          };
          break;
      }
      if (status !== 'picked') {
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

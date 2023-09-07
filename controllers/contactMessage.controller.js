const { ContactMessage } = require('../models/models');
const nodemailer = require('nodemailer');
const path = require('path');

class ContactMessageController {
  async create(req, res) {
    try {
      const { name, surname, phone, email, message } = req.body;
      const contactMessage = await ContactMessage.create({ name, surname, phone, email, message });
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
        <div style="width: 100%; height: 420px; background: #12222d; padding-top: 30px; text-align: center">
          <img src="cid:letter" alt="" width="200" height="200">
          <h1 style="color: #F4B41A">Thank you for contacting us!</h1>
          <h3 style="color: white">Dear ${name}!<br>We have received your message! <br />
    We will reach you out imminently.
         </h3>
        </div>`,
        attachments: [
          {
            filename: 'letter.png',
            path: path.resolve(__dirname, '..', 'public', 'letter.png'),
            cid: 'letter',
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
      res.send(contactMessage);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const contactMessages = await ContactMessage.findAll();
      res.send(contactMessages);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      const contactMessage = await ContactMessage.destroy({
        where: { id },
      });
      return res.json({ succes: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new ContactMessageController();

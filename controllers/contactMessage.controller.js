const { ContactMessage } = require('../models/models');
const nodemailer = require('nodemailer');

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
        subject: 'Test',
        text: `${name}, We successfully get your message)`,
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

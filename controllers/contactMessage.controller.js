const { ContactMessage } = require('../models/models');

class ContactMessageController {
  async create(req, res) {
    try {
      const { name, surname, phone, email, message } = req.body;
      const contactMessage = await ContactMessage.create({ name, surname, phone, email, message });
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
}

module.exports = new ContactMessageController();

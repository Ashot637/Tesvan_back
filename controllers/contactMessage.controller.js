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
      const contactMessages = await ContactMessage.findAll({ order: [['id', 'ASC']] });
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

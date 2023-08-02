const { Orders, Device } = require('../models/models');

class OrdersController {
  async create(req, res) {
    try {
      let { devices, name, surname, phone, email, message, address, region, choice } = req.body;
      message = message || '';
      const order = await Orders.create({
        devices,
        name,
        surname,
        phone,
        email,
        message,
        address,
        region,
        choice,
      });
      devices.forEach((deviceId) => {
        Device.decrement('quantity', { by: 1, where: { id: deviceId } });
      });
      res.send(order);
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
}

module.exports = new OrdersController();

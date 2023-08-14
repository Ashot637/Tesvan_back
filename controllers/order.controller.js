const { Orders, Device } = require('../models/models');

class OrdersController {
  async create(req, res) {
    try {
      let { devices, name, surname, phone, email, message, address, region, payment, delivery } =
        req.body;
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
        payment,
        delivery,
      });
      devices = JSON.parse(devices);
      devices.map((device) => {
        Device.decrement('quantity', { by: device.count, where: { id: device.id } });
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
      const { status } = req.body;
      const { id } = req.params;
      const order = await Orders.update(
        {
          status,
        },
        {
          where: { id },
        },
      );

      return res.json({ succes: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new OrdersController();

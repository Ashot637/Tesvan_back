const { Brand } = require('../models/models');
const uuid = require('uuid');
const path = require('path');

class BrandController {
  async create(req, res) {
    try {
      const { title } = req.body;
      const { img } = req.files;
      const fileName = uuid.v4() + '.png';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const brand = await Brand.create({ title, img: fileName });

      return res.send(brand);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const brands = await Brand.findAll();
      return res.send(brands);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new BrandController();

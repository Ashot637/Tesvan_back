const { Brand, Device } = require('../models/models');

class BrandController {
  async create(req, res) {
    try {
      const { title, img } = req.body;

      const brand = await Brand.create({ title, img });

      return res.send(brand);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const { categorieId } = req.query;
      let brands;
      if (+categorieId) {
        let devices = await Device.findAll({ where: { categorieId }, order: [['id', 'ASC']] });
        let uniqueValues = devices.map((device) => device.brandId);
        uniqueValues = [...new Set(uniqueValues.flat())];
        brands = await Brand.findAll({ where: { id: uniqueValues } });
      } else {
        brands = await Brand.findAll({ order: [['id', 'ASC']] });
      }
      return res.send(brands);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const brand = await Brand.findOne({
        where: { id },
      });
      return res.json(brand);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      const brand = await Brand.destroy({
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
      let { title, img } = req.body;
      const { id } = req.params;

      await Brand.update(
        {
          title,
          img,
        },
        {
          where: {
            id,
          },
        },
      );

      return res.json({ success: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new BrandController();

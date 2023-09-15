const { Region } = require('../models/models');

class RegionController {
  async create(req, res) {
    try {
      const { title_en, title_am, title_ru, price } = req.body;
      const region = await Region.create({
        title_en,
        title_am,
        title_ru,
        price,
      });
      res.send(region);
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }

  async getAll(req, res) {
    try {
      const { language } = req.headers;
      let regions = await Region.findAll({});

      if (language) {
        if (language === 'am') {
          regions = regions.map((region) => {
            return {
              ...region.dataValues,
              title: region.title_am,
            };
          });
        } else if (language === 'ru') {
          regions = regions.map((region) => {
            return {
              ...region.dataValues,
              title: region.title_ru,
            };
          });
        } else {
          regions = regions.map((region) => {
            return {
              ...region.dataValues,
              title: region.title_en,
            };
          });
        }
      }

      res.send(regions);
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const region = await Region.findOne({ where: { id } });
      res.send(region);
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }

  async updateOne(req, res) {
    try {
      const { id } = req.params;
      const { title_en, title_am, title_ru, price } = req.body;
      await Region.update(
        {
          title_en,
          title_am,
          title_ru,
          price,
        },
        { where: { id } },
      );
      res.send({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      await Region.destroy({ where: { id } });
      res.send({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }
}

module.exports = new RegionController();

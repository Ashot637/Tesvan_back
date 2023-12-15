const { DeviceInfoCategorie } = require("../models/models");

class DeviceInfoCategorieController {
  async create(req, res) {
    try {
      const { title_am, title_ru, title_en } = req.body;

      const deviceInfoCategorie = await DeviceInfoCategorie.create({
        title_am,
        title_ru,
        title_en,
      });

      return res.send(deviceInfoCategorie);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const { language } = req.query;
      let deviceInfoCategories;
      if (language) {
        deviceInfoCategories = await DeviceInfoCategorie.findAll({
          attributes: [[`title_${language}`, `title`], "id", "title_en"],
        });
      } else {
        deviceInfoCategories = await DeviceInfoCategorie.findAll();
      }
      return res.send(deviceInfoCategories);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;

      const deviceInfoCategorie = await DeviceInfoCategorie.findOne({
        where: { id },
      });

      return res.json(deviceInfoCategorie);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      const deviceInfoCategorie = await DeviceInfoCategorie.destroy({
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
      let { title_am, title_ru, title_en } = req.body;
      const { id } = req.params;

      await DeviceInfoCategorie.update(
        {
          title_am,
          title_ru,
          title_en,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.json({ success: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new DeviceInfoCategorieController();

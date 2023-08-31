const { DeviceInfoCategorie } = require('../models/models');

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
      const language = req.headers.language;

      let deviceInfoCategories = await DeviceInfoCategorie.findAll();

      if (language) {
        if (language === 'am') {
          deviceInfoCategories = deviceInfoCategories.map((deviceInfoCategorie) => {
            return {
              ...deviceInfoCategorie.dataValues,
              title: deviceInfoCategorie.title_am,
            };
          });
        } else if (language === 'ru') {
          deviceInfoCategories = deviceInfoCategories.map((deviceInfoCategorie) => {
            return {
              ...deviceInfoCategorie.dataValues,
              title: deviceInfoCategorie.title_ru,
            };
          });
        } else {
          deviceInfoCategories = deviceInfoCategories.map((deviceInfoCategorie) => {
            return {
              ...deviceInfoCategorie.dataValues,
              title: deviceInfoCategorie.title_en,
            };
          });
        }
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
      const language = req.headers.language;

      const deviceInfoCategorie = await DeviceInfoCategorie.findOne({
        where: { id },
      });

      if (language) {
        if (language === 'am') {
          var { title_am, title_ru, title_en, ...data } = deviceInfoCategorie.dataValues;
          data.title = title_am;
        } else if (language === 'ru') {
          var { title_am, title_ru, title_en, ...data } = deviceInfoCategorie.dataValues;
          data.title = title_ru;
        } else {
          var { title_am, title_ru, title_en, ...data } = deviceInfoCategorie.dataValues;
          data.title = title_en;
        }
        return res.json(data);
      }

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
        },
      );

      return res.json({ success: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new DeviceInfoCategorieController();

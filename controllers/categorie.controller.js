const { Categorie } = require('../models/models');

class CategorieController {
  async create(req, res) {
    try {
      const { title_am, title_ru, title_en, img } = req.body;

      const categorie = await Categorie.create({ title_am, title_ru, title_en, img });

      return res.send(categorie);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const language = req.headers.language;

      const categories = await Categorie.findAll();

      if (language) {
        if (language === 'am') {
          categories = categories.map((categorie) => {
            let { title_am, title_ru, title_en, ...data } = categorie.dataValues;
            return {
              ...data,
              title: title_am,
            };
          });
        } else if (language === 'ru') {
          categories = categories.map((categorie) => {
            let { title_am, title_ru, title_en, ...data } = categorie.dataValues;
            return {
              ...data,
              title: title_ru,
            };
          });
        } else {
          categories = categories.map((categorie) => {
            let { title_am, title_ru, title_en, ...data } = categorie.dataValues;
            return {
              ...data,
              title: title_en,
            };
          });
        }
      }
      return res.send(categories);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const language = req.headers.language;

      const categorie = await Categorie.findOne({
        where: { id },
      });

      if (language) {
        if (language === 'am') {
          var { title_am, title_ru, title_en, ...data } = categorie.dataValues;
          data.title = title_am;
        } else if (language === 'ru') {
          var { title_am, title_ru, title_en, ...data } = categorie.dataValues;
          data.title = title_ru;
        } else {
          var { title_am, title_ru, title_en, ...data } = categorie.dataValues;
          data.title = title_en;
        }
        return res.json(data);
      }

      return res.json(categorie);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      const categorie = await Categorie.destroy({
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
      let { title_am, title_ru, title_en, img } = req.body;
      const { id } = req.params;

      await Categorie.update(
        {
          title_am,
          title_ru,
          title_en,
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

module.exports = new CategorieController();

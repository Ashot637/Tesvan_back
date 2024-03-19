const { Categorie } = require('../models/models');

class CategorieController {
  async create(req, res) {
    try {
      const { title_am, title_ru, title_en, img } = req.body;

      const categorie = await Categorie.create({
        title_am,
        title_ru,
        title_en,
        img,
      });

      return res.send(categorie);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const { language } = req.query;
      let categories;

      if (language) {
        categories = await Categorie.findAll({
          order: [['order', 'ASC']],
          attributes: [[`title_${language}`, `title`], 'id', 'title_en', 'img'],
        });
      } else {
        categories = await Categorie.findAll({
          order: [['order', 'ASC']],
        });
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

      const categorie = await Categorie.findOne({
        where: { id },
      });

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

  async updateOrder(req, res) {
    try {
      let { newOrder } = req.body;

      for (const { id, order } of newOrder) {
        await Categorie.update({ order }, { where: { id } });
      }

      return res.json({ success: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new CategorieController();

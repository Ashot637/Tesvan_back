const { Categorie } = require('../models/models');

class CategorieController {
  async create(req, res) {
    try {
      const { title, img } = req.body;

      const categorie = await Categorie.create({ title, img });

      return res.send(categorie);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const categories = await Categorie.findAll();
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
      let { title, img } = req.body;
      const { id } = req.params;

      await Categorie.update(
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

module.exports = new CategorieController();

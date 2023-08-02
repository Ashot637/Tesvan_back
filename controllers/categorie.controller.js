const { Categorie } = require('../models/models');
const uuid = require('uuid');
const path = require('path');

class CategorieController {
  async create(req, res) {
    try {
      const { title } = req.body;
      const { img } = req.files;
      const fileName = uuid.v4() + '.png';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const categorie = await Categorie.create({ title, img: fileName });

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
}

module.exports = new CategorieController();

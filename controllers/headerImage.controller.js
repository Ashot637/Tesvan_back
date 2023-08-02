const { HeaderImage } = require('../models/models');
const uuid = require('uuid');
const path = require('path');

class HeaderImageController {
  async create(req, res) {
    try {
      const { title, description, deviceId } = req.body;
      const { img } = req.files;
      const fileName = uuid.v4() + '.png';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const image = await HeaderImage.create({ deviceId, title, description, img: fileName });

      return res.send(image);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const images = await HeaderImage.findAll();
      return res.send(images);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new HeaderImageController();

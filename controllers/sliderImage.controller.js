const { SliderImage } = require('../models/models');
const uuid = require('uuid');
const path = require('path');

class SliderImageController {
  async create(req, res) {
    try {
      const { title, deviceId } = req.body;
      const { img } = req.files;
      const fileName = uuid.v4() + '.png';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const image = await SliderImage.create({ deviceId, title, img: fileName });

      return res.send(image);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const images = await SliderImage.findAll();
      return res.send(images);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new SliderImageController();

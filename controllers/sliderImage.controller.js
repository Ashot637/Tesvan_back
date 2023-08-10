const { SliderImage } = require('../models/models');

class SliderImageController {
  async create(req, res) {
    try {
      const { title, deviceId, img } = req.body;

      const image = await SliderImage.create({ deviceId, title, img });

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

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const sliderImage = await SliderImage.findOne({
        where: { id },
      });
      return res.json(sliderImage);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      const sliderImage = await SliderImage.destroy({
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
      let { title, img, deviceId } = req.body;
      const { id } = req.params;

      await SliderImage.update(
        {
          title,
          img,
          deviceId,
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

module.exports = new SliderImageController();

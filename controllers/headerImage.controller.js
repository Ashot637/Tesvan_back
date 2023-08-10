const { HeaderImage } = require('../models/models');

class HeaderImageController {
  async create(req, res) {
    try {
      const { title, description, deviceId, img } = req.body;

      const image = await HeaderImage.create({ deviceId, title, description, img });

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

  async getAll(req, res) {
    try {
      const images = await HeaderImage.findAll();
      return res.send(images);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const headerImage = await HeaderImage.findOne({
        where: { id },
      });
      return res.json(headerImage);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      const headerImage = await HeaderImage.destroy({
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
      let { title, img, deviceId, description } = req.body;
      const { id } = req.params;

      await HeaderImage.update(
        {
          title,
          img,
          deviceId,
          description,
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

module.exports = new HeaderImageController();

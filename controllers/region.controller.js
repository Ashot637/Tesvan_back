const { Region } = require("../models/models");

class RegionController {
  async create(req, res) {
    try {
      const { title_en, title_am, title_ru, price } = req.body;
      const region = await Region.create({
        title_en,
        title_am,
        title_ru,
        price,
      });
      res.send(region);
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }

  async getAll(req, res) {
    try {
      const { language } = req.query;
      let regions;
      if (language) {
        regions = await Region.findAll({
          attributes: [
            [`title_${language}`, `title`],
            "id",
            "title_en",
            "price",
          ],
        });
      } else {
        regions = await Region.findAll({});
      }

      res.send(regions);
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const region = await Region.findOne({ where: { id } });
      res.send(region);
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }

  async updateOne(req, res) {
    try {
      const { id } = req.params;
      const { title_en, title_am, title_ru, price } = req.body;
      await Region.update(
        {
          title_en,
          title_am,
          title_ru,
          price,
        },
        { where: { id } }
      );
      res.send({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      await Region.destroy({ where: { id } });
      res.send({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }

  async createMany(req, res) {
    try {
      let { titles_en, titles_am, titles_ru } = req.body;

      titles_en = titles_en.split(" ");
      titles_am = titles_am.split(" ");
      titles_ru = titles_ru.split(" ");

      if (
        titles_en.length !== titles_am.length ||
        titles_am.length !== titles_ru.length
      ) {
        return res.status(500).json({ message: "Lengths are not equal" });
      }

      for (let i = 0; i < titles_am.length; i++) {
        await Region.create({
          title_en: titles_en[i],
          title_am: titles_am[i],
          title_ru: titles_ru[i],
          price: 0,
        });
      }

      res.send({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }
}

module.exports = new RegionController();

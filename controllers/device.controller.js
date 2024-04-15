const { Op } = require("sequelize");
const { Device, DeviceInfo, Brand, Categorie } = require("../models/models");
const uuid = require("uuid");
const path = require("path");

class DeviceController {
  async create(req, res) {
    try {
      let {
        code,
        title,
        price,
        oldPrice,
        typeId,
        brandId,
        categorieId,
        info,
        quantity,
        images,
      } = req.body;

      images = images.split(",");
      const device = await Device.create({
        code,
        title,
        price,
        oldPrice,
        quantity,
        typeId,
        brandId,
        categorieId,
        images,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => {
          DeviceInfo.create({
            title_en: i.title_en.trim(),
            title_am: i.title_am.trim(),
            title_ru: i.title_ru.trim(),
            description_en: i.description_en.trim(),
            description_am: i.description_am.trim(),
            description_ru: i.description_ru.trim(),
            deviceId: device.id,
            deviceInfoCategorieId: i.deviceInfoCategorieId,
            order: i.order,
          });
        });
      }

      return res.send(device);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      let { typeId, categorieId, limit, byId, page } = req.query;
      const { language } = req.query;

      categorieId = +categorieId;
      page = page || 1;
      limit = limit || 12;

      let offset = page * limit - limit;
      let devices;
      if (byId) {
        devices = await Device.findAll({
          order: [["id", "ASC"]],
          limit,
          offset,
          include: [
            { model: Brand, as: "brand" },
            { model: Categorie, as: "categorie" },
          ],
        });
        let length = (await Device.findAll()).length;
        let pagination = Math.ceil(length / limit);
        return res.send({ devices, pagination });
      }
      if (typeId) {
        devices = await Device.findAll({
          where: {
            typeId,
          },
          order: [["quantity", "DESC"]],
          include: [
            {
              model: DeviceInfo,
              as: "info",
              attributes: [
                [`title_${language}`, `title`],
                [`description_${language}`, `description`],
                "id",
                "title_en",
              ],
            },
            { model: Brand, as: "brand" },
            {
              model: Categorie,
              as: "categorie",
              attributes: [[`title_${language}`, `title`], "id", "title_en"],
            },
          ],
          limit,
          offset,
        });
        return res.send(devices);
      }
      if (categorieId) {
        devices = await Device.findAll({
          where: {
            categorieId,
          },
          order: [["quantity", "DESC"]],
          include: [
            {
              model: DeviceInfo,
              as: "info",
              attributes: [
                [`title_${language}`, `title`],
                [`description_${language}`, `description`],
                "id",
                "title_en",
              ],
            },
            { model: Brand, as: "brand" },
            {
              model: Categorie,
              as: "categorie",
              attributes: [[`title_${language}`, `title`], "id", "title_en"],
            },
          ],
          limit,
          offset,
        });
      }
      return res.send(devices);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const { language } = req.query;
      let device;
      if (language) {
        device = await Device.findOne({
          where: { id },
          include: [
            {
              model: DeviceInfo,
              as: "info",
              attributes: [
                [`title_${language}`, `title`],
                [`description_${language}`, `description`],
                "id",
                "title_en",
                "deviceInfoCategorieId",
              ],
              order: [["order", "ASC"]],
            },
            { model: Brand, as: "brand" },
            {
              model: Categorie,
              as: "categorie",
              attributes: [[`title_${language}`, `title`], "id", "title_en"],
            },
          ],
        });
      } else {
        device = await Device.findOne({
          where: { id },
          include: [
            { model: DeviceInfo, as: "info", order: [["order", "ASC"]] },
          ],
        });
      }
      return res.json(device);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params;
      const device = await Device.destroy({
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
      let {
        code,
        title,
        price,
        oldPrice,
        typeId,
        brandId,
        categorieId,
        info,
        quantity,
        images,
      } = req.body;
      const { id } = req.params;

      images = images.split(",");

      const device = await Device.findOne({ where: { id } });
      await Device.update(
        {
          code,
          title,
          price,
          oldPrice,
          quantity,
          typeId,
          brandId,
          categorieId,
          images,
        },
        {
          where: {
            id,
          },
        }
      );

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => {
          if (i.id) {
            DeviceInfo.update(
              {
                title_en: i.title_en.trim(),
                title_am: i.title_am.trim(),
                title_ru: i.title_ru.trim(),
                description_en: i.description_en.trim(),
                description_am: i.description_am.trim(),
                description_ru: i.description_ru.trim(),
                deviceId: device.id,
                deviceInfoCategorieId: i.deviceInfoCategorieId,
                order: i.order,
              },
              {
                where: {
                  id: i.id,
                },
              }
            );
          } else {
            DeviceInfo.create({
              title_en: i.title_en.trim(),
              title_am: i.title_am.trim(),
              title_ru: i.title_ru.trim(),
              description_en: i.description_en.trim(),
              description_am: i.description_am.trim(),
              description_ru: i.description_ru.trim(),
              deviceId: device.id,
              deviceInfoCategorieId: i.deviceInfoCategorieId,
              order: i.order,
            });
          }
        });
      }

      return res.json(device);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async removeInfo(req, res) {
    try {
      const { id } = req.params;

      await DeviceInfo.destroy({ where: { id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getMany(req, res) {
    try {
      const { ids } = req.body;
      const { language } = req.query;
      let devices = await Device.findAll({
        where: { id: ids },
        include: [
          {
            model: DeviceInfo,
            as: "info",
            attributes: [
              [`title_${language}`, `title`],
              [`description_${language}`, `description`],
              "id",
              "title_en",
              "deviceInfoCategorieId",
            ],
          },
          { model: Brand, as: "brand" },
          {
            model: Categorie,
            as: "categorie",
            attributes: [[`title_${language}`, `title`], "id", "title_en"],
          },
        ],
      });
      return res.json(devices);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async search(req, res) {
    try {
      const { title } = req.body;
      const devices = await Device.findAll({
        where: {
          title: {
            [Op.iLike]: `%${title}%`,
          },
        },
        limit: 3,
        include: [
          {
            model: Categorie,
            as: "categorie",
            attributes: ["title_en"],
          },
        ],
      });
      return res.json(devices);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async getAllFiltres(req, res) {
    try {
      const { categorieId } = req.query;
      const { language } = req.query;

      let devices = await Device.findAll({
        where: {
          categorieId,
        },
        include: [
          {
            model: DeviceInfo,
            as: "info",
          },
        ],
      });

      const transformedData = {};

      devices.forEach((device) => {
        device.info.forEach((infoItem) => {
          if (infoItem.title_en === "Processor") return;
          const title = infoItem[`title_${language}`];
          const description = infoItem[`description_${language}`];
          if (!transformedData[title]) {
            transformedData[title] = [];
          }
          transformedData[title].push(description.trim());
        });
      });

      const resultArray = Object.keys(transformedData).map((title) => {
        if (title === "RAM") {
          return {
            title,
            description: [
              ...new Set(
                transformedData[title].map((x) =>
                  x.split(" ").slice(0, 2).join(" ")
                )
              ),
            ].sort((a, b) => {
              const first = parseInt(a.split(" ")[0]);
              const second = parseInt(b.split(" ")[0]);
              return first - second;
            }),
          };
        }
        const numericValues = transformedData[title].map((str) => {
          const matches = str.match(/\d+(\.\d+)?/g);
          return matches ? matches.map(Number) : [];
        });
        return {
          title,
          description: [...new Set(transformedData[title])].sort((a, b) => {
            const numA = numericValues[transformedData[title].indexOf(a)][0];
            const numB = numericValues[transformedData[title].indexOf(b)][0];
            return numA - numB;
          }),
        };
      });
      return res.json(resultArray);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async filter(req, res) {
    try {
      let {
        brandIds,
        categorieId,
        limit,
        page,
        minPrice,
        maxPrice,
        sortName,
        sortFollowing,
        language,
        ...data
      } = req.query;

      categorieId = +categorieId;
      page = page || 1;
      limit = limit || 12;
      minPrice = +minPrice || 0;
      maxPrice = +maxPrice || 2000000;
      sortName = sortName || "price";
      sortFollowing = sortFollowing || "DESC";

      let offset = page * limit - limit;
      let devices;
      if (!brandIds?.length) {
        devices = await Device.findAll({
          where: {
            categorieId,
            price: {
              [Op.and]: {
                [Op.gte]: minPrice,
                [Op.lte]: maxPrice,
              },
            },
          },
          order: [[sortName, sortFollowing]],
          include: [
            {
              model: DeviceInfo,
              as: "info",
            },
            { model: Brand, as: "brand" },
            {
              model: Categorie,
              as: "categorie",
              attributes: [[`title_${language}`, `title`], "id", "title_en"],
            },
          ],
        });
      }
      if (brandIds?.length) {
        devices = await Device.findAll({
          where: {
            categorieId,
            price: {
              [Op.and]: {
                [Op.gte]: minPrice,
                [Op.lte]: maxPrice,
              },
            },
            brandId: {
              [Op.in]: brandIds,
            },
          },
          order: [[sortName, sortFollowing]],
          include: [
            {
              model: DeviceInfo,
              as: "info",
            },
            { model: Brand, as: "brand" },
            {
              model: Categorie,
              as: "categorie",
              attributes: [[`title_${language}`, `title`], "id", "title_en"],
            },
          ],
        });
      }

      let result = devices.map((device) => {
        const obj = {};
        return device.info.map((item, i) => {
          obj[item[`title_${language}`]] =
            item[`description_${language}`].trim();
          return i === device.info.length - 1 &&
            Object.entries(data).every(([key, value]) => {
              if (key === "RAM") {
                return value.includes(
                  obj[key].split(" ").slice(0, 2).join(" ")
                );
              }
              if (["Processor", "Պրոցեսոր", "Процессор"].includes(key)) {
                return !!value.find((processor) =>
                  obj[key].includes(processor)
                );
              }
              return value.includes(obj[key]);
            })
            ? device
            : null;
        });
      });

      result = result.flat();
      result = result.filter((e) => e);
      let pagination = Math.ceil(result.length / limit);
      result = result.slice(offset, offset + 12);

      return res.json({ result, pagination });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async uploadImage(req, res) {
    try {
      const { img } = req.files;
      const type = img.mimetype.split("/")[1];
      const fileName = uuid.v4() + "." + type;
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      return res.json({ url: fileName });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new DeviceController();

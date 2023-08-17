const { Op } = require('sequelize');
const { Device, DeviceInfo } = require('../models/models');
const uuid = require('uuid');
const path = require('path');

const getRussianValues = (devices) => {
  devices = devices.map((device) => {
    let newDevice = {
      ...device.dataValues,
      info: device.info.map((i) => {
        let {
          title_am,
          title_en,
          title_ru,
          description_am,
          description_en,
          description_ru,
          ...data
        } = i.dataValues;
        return { ...data, title: title_ru, description: description_ru };
      }),
    };
    return newDevice;
  });
  return devices;
};

const getArmenainValues = (devices) => {
  devices = devices.map((device) => {
    let newDevice = {
      ...device.dataValues,
      info: device.info.map((i) => {
        let {
          title_am,
          title_en,
          title_ru,
          description_am,
          description_en,
          description_ru,
          ...data
        } = i.dataValues;
        return { ...data, title: title_am, description: description_am };
      }),
    };
    return newDevice;
  });
  return devices;
};

const getEnglishValues = (devices) => {
  devices = devices.map((device) => {
    let newDevice = {
      ...device.dataValues,
      info: device.info.map((i) => {
        let {
          title_am,
          title_en,
          title_ru,
          description_am,
          description_en,
          description_ru,
          ...data
        } = i.dataValues;
        return { ...data, title: title_en, description: description_en };
      }),
    };
    return newDevice;
  });
  return devices;
};

class DeviceController {
  async create(req, res) {
    try {
      let { title, price, oldPrice, typeId, brandId, categorieId, info, quantity, images } =
        req.body;

      images = images.split(',');
      const device = await Device.create({
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
            title_en: i.title_en,
            title_am: i.title_am,
            title_ru: i.title_ru,
            description_en: i.description_en,
            description_am: i.description_am,
            description_ru: i.description_ru,
            deviceId: device.id,
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
      let {
        typeId,
        brandId,
        categorieId,
        limit,
        page,
        minPrice,
        maxPrice,
        sortName,
        sortFollowing,
      } = req.query;
      const { language } = req.headers;

      brandId = +brandId;
      categorieId = +categorieId;
      page = page || 1;
      limit = limit || 12;
      minPrice = +minPrice || 0;
      maxPrice = +maxPrice || 2000000;
      sortName = sortName || 'price';
      sortFollowing = sortFollowing || 'DESC';

      let offset = page * limit - limit;
      let devices;
      if (!typeId && !brandId && !categorieId) {
        devices = await Device.findAll({
          where: {
            price: {
              [Op.and]: {
                [Op.gte]: minPrice,
                [Op.lte]: maxPrice,
              },
            },
          },
          include: [{ model: DeviceInfo, as: 'info' }],
          limit,
          offset,
        });
        if (language === 'am') {
          devices = getArmenainValues(devices);
        } else if (language === 'ru') {
          devices = getRussianValues(devices);
        } else {
          devices = getEnglishValues(devices);
        }
        return res.send(devices);
      }
      if (typeId) {
        devices = await Device.findAll({
          where: {
            typeId,
            price: {
              [Op.and]: {
                [Op.gte]: minPrice,
                [Op.lte]: maxPrice,
              },
            },
          },
          include: [{ model: DeviceInfo, as: 'info' }],
          limit,
          offset,
        });
        if (language === 'am') {
          devices = getArmenainValues(devices);
        } else if (language === 'ru') {
          devices = getRussianValues(devices);
        } else {
          devices = getEnglishValues(devices);
        }
        return res.send(devices);
      }
      if (brandId && !categorieId) {
        devices = await Device.findAll({
          where: {
            brandId,
            price: {
              [Op.and]: {
                [Op.gte]: minPrice,
                [Op.lte]: maxPrice,
              },
            },
          },
          order: [[sortName, sortFollowing]],
          include: [{ model: DeviceInfo, as: 'info' }],
          limit,
          offset,
        });
        if (language === 'am') {
          devices = getArmenainValues(devices);
        } else if (language === 'ru') {
          devices = getRussianValues(devices);
        } else {
          devices = getEnglishValues(devices);
        }
      }
      if (!brandId && categorieId) {
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
          include: [{ model: DeviceInfo, as: 'info' }],
          limit,
          offset,
        });
        if (language === 'am') {
          devices = getArmenainValues(devices);
        } else if (language === 'ru') {
          devices = getRussianValues(devices);
        } else {
          devices = getEnglishValues(devices);
        }
      }
      if (brandId && categorieId) {
        devices = await Device.findAll({
          where: {
            brandId,
            categorieId,
            price: {
              [Op.and]: {
                [Op.gte]: minPrice,
                [Op.lte]: maxPrice,
              },
            },
          },
          order: [[sortName, sortFollowing]],
          include: [{ model: DeviceInfo, as: 'info' }],
          limit,
          offset,
        });
        if (language === 'am') {
          devices = getArmenainValues(devices);
        } else if (language === 'ru') {
          devices = getRussianValues(devices);
        } else {
          devices = getEnglishValues(devices);
        }
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
      const { language } = req.headers;
      let device = await Device.findOne({
        where: { id },
        include: [{ model: DeviceInfo, as: 'info' }],
      });
      if (language) {
        if (language === 'am') {
          device = {
            ...device.dataValues,
            info: device.info.map((i) => {
              let {
                title_am,
                title_en,
                title_ru,
                description_am,
                description_en,
                description_ru,
                ...data
              } = i.dataValues;
              return { ...data, title: title_am, description: description_am };
            }),
          };
        } else if (language === 'ru') {
          device = {
            ...device.dataValues,
            info: device.info.map((i) => {
              let {
                title_am,
                title_en,
                title_ru,
                description_am,
                description_en,
                description_ru,
                ...data
              } = i.dataValues;
              return { ...data, title: title_ru, description: description_ru };
            }),
          };
        } else {
          device = {
            ...device.dataValues,
            info: device.info.map((i) => {
              let {
                title_am,
                title_en,
                title_ru,
                description_am,
                description_en,
                description_ru,
                ...data
              } = i.dataValues;
              return { ...data, title: title_en, description: description_en };
            }),
          };
        }
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
      let { title, price, oldPrice, typeId, brandId, categorieId, info, quantity, images } =
        req.body;
      const { id } = req.params;

      images = images.split(',');

      const device = await Device.findOne({ where: { id } });
      await Device.update(
        {
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
        },
      );

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => {
          if (i.id) {
            DeviceInfo.update(
              {
                title_en: i.title_en,
                title_am: i.title_am,
                title_ru: i.title_ru,
                description_en: i.description_en,
                description_am: i.description_am,
                description_ru: i.description_ru,
                deviceId: device.id,
              },
              {
                where: {
                  id: i.id,
                },
              },
            );
          } else {
            DeviceInfo.create({
              title_en: i.title_en,
              title_am: i.title_am,
              title_ru: i.title_ru,
              description_en: i.description_en,
              description_am: i.description_am,
              description_ru: i.description_ru,
              deviceId: device.id,
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
      const devices = await Device.findAll({
        where: { id: ids },
        include: [{ model: DeviceInfo, as: 'info' }],
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
        include: [{ model: DeviceInfo, as: 'info' }],
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
      const { language } = req.headers;

      let devices = await Device.findAll({
        where: {
          categorieId,
        },
        include: [{ model: DeviceInfo, as: 'info' }],
      });
      if (language === 'am') {
        devices = getArmenainValues(devices);
      } else if (language === 'ru') {
        devices = getRussianValues(devices);
      } else {
        devices = getEnglishValues(devices);
      }
      let uniqueValues = devices.map((e) => e.info.map((i) => i.title));
      uniqueValues = [...new Set(uniqueValues.flat())];
      let obj = {};
      for (let title of uniqueValues) {
        obj[title] = [];
      }
      devices.forEach((device) =>
        device.info.forEach((i) => {
          let key = i.title;
          obj[key] = [...obj[key], i.description];
        }),
      );
      let arr = [];
      for (let title in obj) {
        arr.push({
          title: title,
          description: [...new Set(obj[title])],
        });
      }
      return res.json(arr);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async filter(req, res) {
    try {
      let {
        brandId,
        categorieId,
        limit,
        page,
        minPrice,
        maxPrice,
        sortName,
        sortFollowing,
        ...data
      } = req.query;
      const { language } = req.headers;

      brandId = +brandId;
      categorieId = +categorieId;
      page = page || 1;
      limit = limit || 12;
      minPrice = +minPrice || 0;
      maxPrice = +maxPrice || 2000000;
      sortName = sortName || 'price';
      sortFollowing = sortFollowing || 'DESC';

      let offset = page * limit - limit;
      let devices;
      if (!brandId) {
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
          include: [{ model: DeviceInfo, as: 'info' }],
        });
        if (language === 'am') {
          devices = getArmenainValues(devices);
        } else if (language === 'ru') {
          devices = getRussianValues(devices);
        } else {
          devices = getEnglishValues(devices);
        }
      }
      if (brandId) {
        devices = await Device.findAll({
          where: {
            brandId,
            categorieId,
            price: {
              [Op.and]: {
                [Op.gte]: minPrice,
                [Op.lte]: maxPrice,
              },
            },
          },
          order: [[sortName, sortFollowing]],
          include: [{ model: DeviceInfo, as: 'info' }],
        });
        if (language === 'am') {
          devices = getArmenainValues(devices);
        } else if (language === 'ru') {
          devices = getRussianValues(devices);
        } else {
          devices = getEnglishValues(devices);
        }
      }

      const obj = {};

      let result = devices.map((e) => {
        return e.info.map((item, i) => {
          obj[item.title] = item.description;
          return i === e.info.length - 1 &&
            Object.entries(data).every(([key, value]) => obj[key] === value)
            ? e
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
      const fileName = uuid.v4() + '.png';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      return res.json({ url: fileName });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new DeviceController();

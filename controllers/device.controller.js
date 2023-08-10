const { Op, where } = require('sequelize');
const { Device, DeviceInfo } = require('../models/models');
const uuid = require('uuid');
const path = require('path');

class DeviceController {
  async create(req, res) {
    try {
      let { title, price, oldPrice, typeId, brandId, categorieId, info, quantity, img } = req.body;

      const device = await Device.create({
        title,
        price,
        oldPrice,
        quantity,
        typeId,
        brandId,
        categorieId,
        img,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
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
      const device = await Device.findOne({
        where: { id },
        include: [{ model: DeviceInfo, as: 'info' }],
      });
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
      let { title, price, oldPrice, typeId, brandId, categorieId, info, quantity, img } = req.body;
      const { id } = req.params;

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
          img,
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
                title: i.title,
                description: i.description,
                deviceId: device.id,
              },
              {
                where: {
                  id: i.id,
                },
              },
            );
          } else {
            console.log('Created');
            DeviceInfo.create({
              title: i.title,
              description: i.description,
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
      let filterTypes = await Device.findAll({
        include: [{ model: DeviceInfo, as: 'info' }],
      });
      let uniqeValues = filterTypes.map((e) => e.info.map((i) => i.title));
      uniqeValues = [...new Set(uniqeValues.flat())];
      let obj = {};
      for (let title of uniqeValues) {
        obj[title] = [];
      }
      filterTypes.forEach((device) =>
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
    } catch (error) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async filter(req, res) {
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
        ...data
      } = req.query;

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
        });
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
        });
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
        });
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
        });
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
        });
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

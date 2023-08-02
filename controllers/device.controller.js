const { Op } = require('sequelize');
const { Device, DeviceInfo } = require('../models/models');
const uuid = require('uuid');
const path = require('path');

class DeviceController {
  async create(req, res) {
    try {
      let { title, price, oldPrice, typeId, brandId, categorieId, info, quantity } = req.body;
      const { img } = req.files;
      const fileName = uuid.v4() + '.png';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const device = await Device.create({
        title,
        price,
        oldPrice,
        quantity,
        typeId,
        brandId,
        categorieId,
        img: fileName,
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
}

module.exports = new DeviceController();

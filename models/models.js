const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  oldPrice: { type: DataTypes.INTEGER, allowNull: false },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  typeId: { type: DataTypes.INTEGER, allowNull: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
});

const Categorie = sequelize.define('categorie', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title_am: { type: DataTypes.STRING, allowNull: false },
  title_ru: { type: DataTypes.STRING, allowNull: false },
  title_en: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  order: { type: DataTypes.INTEGER, allowNull: true },
});

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

const DeviceInfo = sequelize.define('device_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title_am: { type: DataTypes.STRING, allowNull: false },
  title_ru: { type: DataTypes.STRING, allowNull: false },
  title_en: { type: DataTypes.STRING, allowNull: false },
  description_am: { type: DataTypes.STRING, allowNull: false },
  description_ru: { type: DataTypes.STRING, allowNull: false },
  description_en: { type: DataTypes.STRING, allowNull: false },
  order: { type: DataTypes.INTEGER, allowNull: true },
});

const DeviceInfoCategorie = sequelize.define('device_info_categorie', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title_am: { type: DataTypes.STRING, allowNull: false },
  title_ru: { type: DataTypes.STRING, allowNull: false },
  title_en: { type: DataTypes.STRING, allowNull: false },
  order: { type: DataTypes.INTEGER, allowNull: true },
});

const BrandCategorie = sequelize.define('brand_categorie', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const ContactMessage = sequelize.define('contact_message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
});

const Orders = sequelize.define('orders', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  total: { type: DataTypes.INTEGER, allowNull: false },
  devices: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  region: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: true },
  payment: { type: DataTypes.STRING, allowNull: false },
  delivery: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
});

const HeaderImage = sequelize.define('header_image', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const SliderImage = sequelize.define('slider_image', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
});

const Region = sequelize.define('regions', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title_am: { type: DataTypes.STRING, allowNull: false },
  title_ru: { type: DataTypes.STRING, allowNull: false },
  title_en: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
});

Categorie.hasMany(Device);
Device.belongsTo(Categorie);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device);

DeviceInfoCategorie.hasMany(DeviceInfo);
DeviceInfo.belongsTo(DeviceInfoCategorie);

Categorie.belongsToMany(Brand, { through: BrandCategorie });
Brand.belongsToMany(Categorie, { through: BrandCategorie });

Device.hasOne(HeaderImage);
HeaderImage.belongsTo(Device);

Device.hasOne(SliderImage);
SliderImage.belongsTo(Device);

module.exports = {
  User,
  Device,
  Categorie,
  Brand,
  DeviceInfo,
  DeviceInfoCategorie,
  BrandCategorie,
  ContactMessage,
  Orders,
  HeaderImage,
  SliderImage,
  Region,
};

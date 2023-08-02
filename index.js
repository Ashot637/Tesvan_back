require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const models = require('./models/models');
const deviceRouter = require('./routes/device.routes');
const brandRouter = require('./routes/brand.routes');
const categorieRouter = require('./routes/categorie.routes');
const contactMessageRouter = require('./routes/contactMessage.routes');
const ordersRouter = require('./routes/order.routes');
const headerImageRouter = require('./routes/headerImage.routes');
const sliderImageRouter = require('./routes/sliderImage.routes');
const bodyParser = require('body-parser');
const adminRouter = require('./controllers/admin.controller').router;
const adminBro = require('./controllers/admin.controller').adminBro;

const app = express();

app.use(adminBro.options.rootPath, adminRouter);
app.use(bodyParser.json());

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(cors());
app.use(fileUpload({}));

app.use('/api', deviceRouter);
app.use('/api', brandRouter);
app.use('/api', categorieRouter);
app.use('/api', contactMessageRouter);
app.use('/api', ordersRouter);

app.use('/api/img', headerImageRouter);
app.use('/api/img', sliderImageRouter);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(process.env.PORT || 8080, () => console.log('Server OK'));
  } catch (e) {
    console.log(e);
  }
};

start();

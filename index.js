require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const models = require("./models/models");
const deviceRouter = require("./routes/device.routes");
const deviceInfoCategorieRouter = require("./routes/deviceInfoCategorie.routes");
const brandRouter = require("./routes/brand.routes");
const categorieRouter = require("./routes/categorie.routes");
const contactMessageRouter = require("./routes/contactMessage.routes");
const ordersRouter = require("./routes/order.routes");
const headerImageRouter = require("./routes/headerImage.routes");
const sliderImageRouter = require("./routes/sliderImage.routes");
const regionRouter = require("./routes/region.routes");
const adminRouter = require("./routes/admin.routes");
const bodyParser = require("body-parser");

const app = express();

// app.use((req, res, next) => {
//   if (req.query.language) {
//     res.setHeader("Cache-Control", "public, max-age=3600");
//   }
//   next();
// });

app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "static")));
app.use(cors());
app.use(fileUpload({}));

app.use("/api", deviceRouter);
app.use("/api", brandRouter);
app.use("/api", categorieRouter);
app.use("/api", contactMessageRouter);
app.use("/api", ordersRouter);
app.use("/api", deviceInfoCategorieRouter);
app.use("/api", regionRouter);

app.use("/api/img", headerImageRouter);
app.use("/api/img", sliderImageRouter);

app.use("/api", adminRouter);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(process.env.PORT || 8080, () => console.log("Server OK"));
  } catch (e) {
    console.log(e);
  }
};

start();

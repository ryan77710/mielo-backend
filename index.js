const express = require("express");
const cors = require("cors");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const userRoute = require("./route/user");
app.use(userRoute);

const postRoute = require("./route/post");
app.use(postRoute);

const commentRoute = require("./route/comment");
app.use(commentRoute);

const reportRoute = require("./route/report");
app.use(reportRoute);

app.get("/", (req, res) => {
  res.status(200).send("Home");
});
app.all("*", (req, res) => {
  res.status(404).send("Page introuvable");
});

app.listen(process.env.PORT || 3100, () => {
  console.log("server has started");
});

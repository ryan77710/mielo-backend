const app = require("./src/app");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
app.listen(process.env.PORT || 3200, () => {
  console.log("server has started");
});

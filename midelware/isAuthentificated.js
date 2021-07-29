const User = require("../model/User");
const { findOne } = require("../model/User");
const isAuthentificated = async (req, res, next) => {
  console.log("test enter");
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });
    if (user) {
      console.log("test finish");
      req.user = user;
      return next();
    } else {
      res.status(400).json({ messsage: "Unauthorized :((" });
    }
  } else {
    res.status(400).json({ message: "Unauthorized :(" });
  }
};

module.exports = isAuthentificated;

const User = require("../src/model/User");

const userDeconnection = async (authToken) => {
  const user = await User.findOne({ token: authToken }).select("location");
  user.connected = false;
  user.save();
};

module.exports = { userDeconnection };

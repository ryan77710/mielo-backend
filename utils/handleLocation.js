const User = require("../src/model/User");

const handleLocation = async (arg) => {
  const user = await User.findOne({ token: arg.authToken }).select(
    "location connected"
  );
  user.connected = true;
  user.location = [arg.coords.longitude, arg.coords.latitude];
  user.save();
};

module.exports = { handleLocation };

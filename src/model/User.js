const mongoose = require("mongoose");
//missing clothe ,add friend ,follower,,change username,job,pictures,pictureDay,pictureProfile, post  place
//delete public object //do not forget select to optimize database
const User = mongoose.model("User", {
  email: String,
  username: String,
  description: { type: String, default: "new user" },

  status: {
    type: String,
    value: "user" || "moderator" || "administrator" || "overlord",
  },
  connected: false,
  location: { type: [Number], index: "2d" },

  avatar: {
    hairColor: String,
    sexe: String,
    skin: String,
  },
  account: {
    job: String,
    phone: String,
    birth_date: Number,
    first_name: String,
    last_name: String,
  },
  profilePicture: Object,
  picture_day: Object,
  pictures: [Object],
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  about: {
    link: Array,
    fav_movies: Array,
    fav_series: Array,
    fav_music: Array,
  },

  token: String,
  private: { hash: String, salt: String },
});

module.exports = User;

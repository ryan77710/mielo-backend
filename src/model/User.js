const mongoose = require("mongoose");
//missing clothe ,user rate and post and picture rate
//do not forget select to optimize database
//position post and home location popularity
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
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  numberOfFriends: { type: Number, default: 0 },
  numberOfFollowers: { type: Number, default: 0 },
  numberOfPosts: { type: Number, default: 0 },
  numberOfPictures: { type: Number, default: 0 },
  about: {
    link: [{ id: String, linkType: String, message: String, ref: String, logo: String }],
    fav_movies: [{ id: String, order: Number, title: String }],
    fav_series: [{ id: String, order: Number, title: String }],
    fav_music: [{ id: String, order: Number, title: String }],
    fav_manga: [{ id: String, order: Number, title: String }],
    fav_book: [{ id: String, order: Number, title: String }],
  },

  token: String,
  private: { hash: String, salt: String },
});

module.exports = User;

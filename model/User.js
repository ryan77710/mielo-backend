const mongoose = require("mongoose");
//missing clothe music movie series post
const User = mongoose.model("User", {
  email: String,
  public: {
    avatar: {
      age: Number,
      hairColor: String,
      sexe: String,
      skin: String,
    },
    account: {
      username: String,
      job: String,
      description: { type: String, default: "new user" },
      phone: String,
      profilePicture: Object,
      pictures: [Object],
      post: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
    },
    location: Array,
    link: {
      Facebook: String,
      Twitter: String,
      Youtube: String,
      Snapchat: String,
      Pinterest: String,
      Instagram: String,
      Tiktok: String,
      Linkedin: String,
      Twitch: String,
      Onlyfan: String,
    },
  },
  token: String,
  private: { hash: String, salt: String },
});

module.exports = User;

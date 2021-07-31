const mongoose = require("mongoose");

const Post = mongoose.model("Post", {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  viewed: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    value: "text" || "picture" || "video",
  },
  like: {
    type: Number,
    default: 0,
  },
  postText: {
    text: String,
  },
  postPicture: {
    secure_url: String,
    asset_id: String,
    public_id: String,
  },
  postVideo: {
    secure_url: String,
    asset_id: String,
    public_id: String,
  },
  date: {
    dateNow: Number,
    year: Number,
    mouth: Number,
    day: Number,
    hour: Number,
    minute: Number,
  },

  //put comment in a other colection
  comment: [
    {
      commentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      commentText: String,
      commentLike: {
        type: Number,
        default: 0,
      },
      commentDate: {
        dateNow: Number,
        year: Number,
        mouth: Number,
        day: Number,
        hour: Number,
        minute: Number,
      },
    },
  ],
});

module.exports = Post;

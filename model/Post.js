const mongoose = require("mongoose");
//missing video and date comment
const Post = mongoose.model("Post", {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    value: "text" || "picture" || "video",
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
  comment: [
    {
      commentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      commentText: String,
      like: Number,
    },
  ],
});

module.exports = Post;

const mongoose = require("mongoose");

const Comment = mongoose.model("Comment", {
  commentOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  like: {
    type: Number,
    default: 0,
  },
  commentText: String,

  date: {
    dateNow: Number,
    year: Number,
    mouth: Number,
    day: Number,
    hour: Number,
    minute: Number,
  },
});

module.exports = Comment;

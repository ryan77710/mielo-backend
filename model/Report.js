const mongoose = require("mongoose");

const Report = mongoose.model("Report", {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userIdReported: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    value: "post" || "comment" || "user",
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" || "Post" || "Comment",
  },
  complaint: String,
  status: {
    type: String,
    value: "unProcessed" || "analyse" || "processed",
  },
  response: String,
  date: {
    dateNow: Number,
    year: Number,
    mouth: Number,
    day: Number,
    hour: Number,
    minute: Number,
  },
});

module.exports = Report;

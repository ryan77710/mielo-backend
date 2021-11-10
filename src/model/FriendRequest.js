const mongoose = require("mongoose");

const FriendRequest = mongoose.model("FriendRequest", {
  state: { type: String, value: "pending" || "accept" || "refuse" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receptor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: {
    dateNow: Number,
    year: Number,
    mouth: Number,
    day: Number,
    hour: Number,
    minute: Number,
  },
});

module.exports = FriendRequest;

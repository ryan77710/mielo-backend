const express = require("express");
const router = express.Router();
const User = require("../model/User");
const FriendRequest = require("../model/FriendRequest");
const uid2 = require("uid2");
const isAuthentificated = require("../../middleware/isAuthentificated");
const { findByIdAndDelete } = require("../model/User");

router.post("/follow/add-follower/:id", isAuthentificated, async (req, res) => {
  console.log("route : /follow/add-follower");
  try {
    const id = req.params.id;
    req.user.followers.push(id);
    req.user.numberOfFollowers++;

    req.user.save();
    res.status(400).json({ message: "follower added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/follow/delete-follower/:id", isAuthentificated, async (req, res) => {
  console.log("route : /follow/add-follower");
  try {
    const id = req.params.id;
    const index = req.user.followers.indexOf(id);
    req.user.followers.splice(index, 1);

    req.user.numberOfFollowers--;
    req.user.save();

    res.status(400).json({ message: "follower deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;

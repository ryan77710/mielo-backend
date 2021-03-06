const express = require("express");
const router = express.Router();
const User = require("../model/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const isAuthentificated = require("../../middleware/isAuthentificated");

router.post("/location/around", async (req, res) => {
  console.log("route : /location-arround");
  try {
    const { latitude, longitude } = req.query;
    const filter = {
      connected: true,
      location: {
        $near: [longitude, latitude],
        $maxDistance: 0.05,
      },
    };
    const users = await User.find(filter).select("username location profilePicture");
    res.status(200).json({ message: "users near", users: users });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;

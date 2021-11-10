const express = require("express");
const router = express.Router();
const User = require("../model/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const isAuthentificated = require("../../middleware/isAuthentificated");

router.post("/link/update-link", isAuthentificated, async (req, res) => {
  console.log("route : /link/update-link");
  try {
    const link = req.fields.link;
    req.user.about.link = link;
    req.user.save();
    res.status(200).json({ message: "link update" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
router.post("/link/add-link", isAuthentificated, async (req, res) => {
  console.log("route : /link/add-link");
  try {
    const link = req.fields.link;
    req.user.about.link.push(link);
    req.user.save();
    res.status(200).json({ message: "link added" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
router.post("/link/update-movies", isAuthentificated, async (req, res) => {
  console.log("route : /link/update-movies");
  try {
    const movies = req.fields.movies;
    req.user.about.fav_movies = movies;
    req.user.save();
    res.status(200).json({ message: "fav movies update" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
router.post("/link/update-series", isAuthentificated, async (req, res) => {
  console.log("route : /link/update-series");
  try {
    const series = req.fields.series;
    req.user.about.fav_series = series;
    req.user.save();
    res.status(200).json({ message: "fav series update" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
router.post("/link/update-musics", isAuthentificated, async (req, res) => {
  console.log("route : /link/update-musics");
  try {
    const musics = req.fields.musics;
    req.user.about.fav_music = musics;
    req.user.save();
    res.status(200).json({ message: "fav music update" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
router.post("/link/updateLink", isAuthentificated, async (req, res) => {
  console.log("route : /link/updateLink");
  try {
    const mangas = req.fields.mangas;
    req.user.about.fav_manga = mangas;
    req.user.save();
    res.status(200).json({ message: "fav manga update" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
module.exports = router;

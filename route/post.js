const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Post = require("../model/Post");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthentificated = require("../midelware/isAuthentificated");
const isOwnerPost = require("../midelware/isOwnerPost");
const cloudinary = require("cloudinary").v2;

router.post("/post/publish-text", isAuthentificated, async (req, res) => {
  console.log("route : /post/publish-text");
  const { type, text } = req.fields;
  try {
    const date = new Date();

    const newPost = new Post({
      owner: req.user._id,
      type: type,
      postText: {
        text: text,
      },
      date: {
        dateNow: Date.now(),
        year: date.getFullYear(),
        mouth: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
      },
    });

    req.user.public.account.post.push(newPost._id);
    req.user.save();
    newPost.save();
    res.status(200).json({ message: "post publish", data: newPost });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/post/publish-picture", isAuthentificated, async (req, res) => {
  console.log("route : /post/publish-picture");
  const { type } = req.fields;
  try {
    const picture = req.files.picture;

    const newPost = new Post({
      owner: req.user._id,
      type: type,
      date: {
        dateNow: Date.now(),
        year: date.getFullYear(),
        mouth: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
      },
    });

    const pictureUploaded = await cloudinary.uploader.upload(picture.path, {
      folder: `mielo/post/picture/${newPost._id}/`,
    });

    newPost.postPicture.secure_url = pictureUploaded.secure_url;
    newPost.postPicture.asset_id = pictureUploaded.asset_id;
    newPost.postPicture.public_id = pictureUploaded.public_id;
    req.user.public.account.post.push(newPost._id);

    req.user.save();
    newPost.save();
    res.status(200).json({ message: "post publish", data: newPost });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/post/publish-video", isAuthentificated, async (req, res) => {
  console.log("route : /post/publish-video");
  const { type } = req.fields;
  try {
    const video = req.files.video;

    const newPost = new Post({
      owner: req.user._id,
      type: type,
      date: {
        dateNow: Date.now(),
        year: date.getFullYear(),
        mouth: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
      },
    });
    //size video must be less than 100000 mo else we have to paid cloudinary
    if (video.size <= 100000000) {
      const videoUploaded = await cloudinary.uploader.upload_large(
        video.path,
        {
          folder: `mielo/post/video/${newPost._id}/`,
          resource_type: "video",
          chunk_size: 6000000,
        },
        await function (resError, resResult) {
          if (resResult) {
            console.log("upload granded ");
            newPost.postVideo.secure_url = resResult.secure_url;
            newPost.postVideo.asset_id = resResult.asset_id;
            newPost.postVideo.public_id = resResult.public_id;
            req.user.public.account.post.push(newPost._id);
            req.user.save();
            newPost.save();
            res.status(200).json({ message: "post publish", data: newPost });
          } else {
            if (resError) {
              console.log("upload fail ");
              res
                .status(400)
                .json({ message: "upload video post failed", data: newPost });
            }
          }
        }
      );
    } else {
      res
        .status(400)
        .json({ message: "the video size must be less than 100 mo" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/post/update-text/:id", isOwnerPost, async (req, res) => {
  console.log("route : /post/update/:id");
  try {
    req.post.postText.text = req.fields.text;
    req.post.save();
    res.status(200).json({ message: "post text update", data: req.post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

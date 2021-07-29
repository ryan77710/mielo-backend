const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Post = require("../model/Post");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthentificated = require("../midelware/isAuthentificated");
const cloudinary = require("cloudinary").v2;

router.post("/post/publish-text", isAuthentificated, async (req, res) => {
  console.log("route : /post/publish-text");
  const { type, text } = req.fields;
  try {
    const newPost = new Post({
      owner: req.user._id,
      type: type,
      postText: {
        text: text,
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
    });
    console.log(video);
    //size video must be less than 100 mo else cloudinary can't upload
    // const videoUploaded = await cloudinary.uploader.upload_large(
    //   video.path,
    //   {
    //     folder: `mielo/post/video/${newPost._id}/`,
    //     resource_type: "video",
    //     chunk_size: 6000000,
    //   },
    //   function (error, result) {
    //     console.log(result, error);
    //   }
    // );

    // newPost.postPicture.secure_url = pictureUploaded.secure_url;
    // newPost.postPicture.asset_id = pictureUploaded.asset_id;
    // newPost.postPicture.public_id = pictureUploaded.public_id;
    // req.user.public.account.post.push(newPost._id);

    // req.user.save();
    // newPost.save();
    res.status(200).json({ message: "post publish", data: newPost });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

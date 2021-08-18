const express = require("express");
const router = express.Router();
const User = require("../model/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthentificated = require("../midelware/isAuthentificated");
const cloudinary = require("cloudinary").v2;

router.post("/user/sign-up", async (req, res) => {
  console.log("route: /user/sign-up");
  try {
    const { email, username, description, password } = req.fields;
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      res.status(400).json({ message: "This email already has an account." });
    } else {
      if (!email || !username || !description || !password) {
        res.status(400).json({ message: "Missing parameters" });
      } else {
        const newUser = new User({
          email: email,
          public: {
            account: {
              username: username,
              description: description,
            },
          },
        });

        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);
        newUser.private.hash = hash;
        newUser.token = token;
        newUser.private.salt = salt;
        await newUser.save();

        const new1 = await User.find(newUser).select("public token email");

        res
          .status(200)
          .json({ message: "welcome user created", data: new1[0] });
      }
    }
  } catch (error) {
    res.status(401).json(error.message);
  }
});

router.put("/user/update", isAuthentificated, async (req, res) => {
  console.log("/user/update");
  try {
    const avatar = req.fields.avatar;
    const account = req.fields.account;
    const link = req.fields.link;
    const user = await User.findById(req.user._id).select("public token email");
    //missing the location on select
    if (avatar) {
      user.public.avatar = avatar;
    }
    if (account) {
      user.public.account = account;
    }
    if (link) {
      user.public.link = link;
    }
    await user.save();
    res.status(200).json({ message: "user update", data: user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post(
  "/user/add-profile-picture",
  isAuthentificated,
  async (req, res) => {
    console.log("route : /user/add-profile-picture ");
    try {
      const picture = req.files.picture;

      const pictureUploaded = await cloudinary.uploader.upload(picture.path, {
        folder: `mielo/user/${req.user._id}/profile-picture/`,
      });
      const profilePicture = {
        asset_id: pictureUploaded.asset_id,
        secure_url: pictureUploaded.secure_url,
        public_id: pictureUploaded.public_id,
      };
      req.user.public.account.profilePicture = profilePicture;
      req.user.save();
      res
        .status(200)
        .json({ message: "profile picture add ", data: profilePicture });
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
);

router.post(
  "/user/picture-profile-change",
  isAuthentificated,
  async (req, res) => {
    console.log(" road: /user/picture-profile-change");
    try {
      const picture = req.files.picture.path;

      if (picture) {
        const public_id = req.user.public.account.profilePicture.public_id;
        await cloudinary.uploader.destroy(public_id);

        const pictureUploaded = await cloudinary.uploader.upload(picture, {
          folder: `mielo/user/${req.user._id}/profile-picture/`,
        });
        const profilePicture = {
          asset_id: pictureUploaded.asset_id,
          secure_url: pictureUploaded.secure_url,
          public_id: pictureUploaded.public_id,
        };
        req.user.public.account.profilePicture = profilePicture;
        req.user.save();

        res
          .status(200)
          .json({ message: "picture update", data: profilePicture });
      } else {
        res.status(400).json({ message: "missing picture" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
router.post("/user/add-picture", isAuthentificated, async (req, res) => {
  console.log("route : /user/add-picture");
  try {
    const picture = req.files.picture.path;
    if (picture) {
      const public_id = req.user.public.account.profilePicture.public_id;
      await cloudinary.uploader.destroy(public_id);

      const pictureUploaded = await cloudinary.uploader.upload(picture, {
        folder: `mielo/user/${req.user._id}/pictures/`,
      });
      const profilePicture = {
        asset_id: pictureUploaded.asset_id,
        secure_url: pictureUploaded.secure_url,
        public_id: pictureUploaded.public_id,
      };
      req.user.public.account.pictures.push(profilePicture);
      req.user.save();
      res.status(200).json({ message: "picture added", data: profilePicture });
    } else {
      res.status(400).json({ message: "missing picture" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/delete-picture", isAuthentificated, async (req, res) => {
  console.log("route : /user/delete-picture");
  try {
    const { asset_id, public_id } = req.fields;
    if (asset_id && public_id) {
      await cloudinary.uploader.destroy(public_id);

      const userPictures = req.user.public.account.pictures;
      for (let i = 0; i < userPictures.length; i++) {
        if (userPictures[i].asset_id === asset_id) {
          userPictures.splice(i, 1);
        }
      }
      req.user.save();
      res.status(200).json({ message: "picture deleted", data: userPictures });
    } else {
      res.status(400).json({ message: "missing public_id or asset_id" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/user/:id", async (req, res) => {
  console.log("route : /user/:id");
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("public email");
    res
      .status(200)
      .json({ message: `user ${user.public.account.username}`, data: user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;

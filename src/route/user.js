const express = require("express");
const router = express.Router();
const User = require("../model/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthentificated = require("../../middleware/isAuthentificated");
const cloudinary = require("cloudinary").v2;

router.post("/user/sign-up", async (req, res) => {
  console.log("route: /user/sign-up");
  try {
    const { email, username, description, password } = req.fields;
    const emailExist = await User.findOne({ email: email });
    const usernameExist = await User.findOne({ username: username });

    if (emailExist || usernameExist) {
      res.status(400).json({ message: "This email or username already has an account." });
    } else {
      if (!email || !username || !description || !password) {
        res.status(400).json({ message: "Missing parameters" });
      } else {
        const newUser = new User({
          email: email,
          username: username,
          description: description,
        });

        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);
        newUser.private.hash = hash;
        newUser.token = token;
        newUser.private.salt = salt;

        const pictureUploaded = await cloudinary.uploader.upload("utils/picture-missing.jpg", {
          folder: `mielo/user/${newUser._id}/profile-picture/`,
        });

        const profilePicture = {
          asset_id: pictureUploaded.asset_id,
          secure_url: pictureUploaded.secure_url,
          public_id: pictureUploaded.public_id,
        };
        newUser.profilePicture = profilePicture;

        await newUser.save();

        const new1 = await User.find(newUser).select("public token email");

        res.status(200).json({ message: "welcome user created", user: new1[0] });
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

router.post("/user/add-profile-picture", isAuthentificated, async (req, res) => {
  console.log("route : /user/add-profile-picture ");
  try {
    const picture = req.files.picture;

    if (picture) {
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
      res.status(200).json({ message: "profile picture add", profilePicture: profilePicture });
    } else {
      res.status(400).json({ message: "picture missing" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/user/picture-profile-change", isAuthentificated, async (req, res) => {
  console.log(" road: /user/picture-profile-change");
  try {
    if (req.files.picture) {
      const picture = req.files.picture.path;

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

      res.status(200).json({ message: "picture update", profilePicture: profilePicture });
    } else {
      res.status(400).json({ message: "missing picture" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/user/add-picture", isAuthentificated, async (req, res) => {
  console.log("route : /user/add-picture");
  try {
    if (req.files.picture) {
      const picture = req.files.picture.path;

      // const public_id = req.user.public.account.profilePicture.public_id;
      // await cloudinary.uploader.destroy(public_id);

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

      res.status(200).json({ message: "picture added", profilePicture: profilePicture });
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
      res.status(200).json({ message: "picture deleted", userPictures: userPictures });
    } else {
      res.status(400).json({ message: "missing public_id or asset_id" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//add to test file /user/login
router.post("/user/login", async (req, res) => {
  console.log("route: /user/login");
  try {
    if (req.fields.email && req.fields.password) {
      const findUser = await User.findOne({ email: req.fields.email });

      if (findUser) {
        const password = req.fields.password;
        const userSalt = findUser.private.salt;
        const hashToCompare = SHA256(password + userSalt).toString(encBase64);

        if (findUser.private.hash === hashToCompare) {
          const user = {
            _id: findUser._id,
            token: findUser.token,
            username: findUser.username,
            profilePicture: findUser.profilePicture,
          };

          res.status(200).json({ message: "user login", user: user });
        } else {
          res.status(400).json({ message: "email or password incorrect" });
        }
      } else {
        res.status(400).json({ message: "email or password incorrect" });
      }
    } else {
      res.status(400).json({ message: "missing field email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/user/check-username/:username", async (req, res) => {
  console.log("route : /user/check-username");
  const { username } = req.params;

  try {
    if (username && username !== "x") {
      const checkUsername = await User.find({ username: username });

      if (checkUsername.length === 0) {
        res.status(200).json({ message: `username available` });
      } else {
        res.status(200).json({ message: `username not available` });
      }
    } else {
      res.status(200).json({ message: "username is x or inexiste" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});
router.get("/user-id/:id", async (req, res) => {
  console.log("route : /user-id/:id");
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("public email");
    res.status(200).json({ message: `user ${user.username}`, data: user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/user-token/:token", async (req, res) => {
  console.log("route : /user-token/:token");
  const { token } = req.params;
  try {
    const user = await User.findOne({ token: token }).select("username profilePicture");
    res.status(200).json({ message: `user ${user.username}`, user: user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;

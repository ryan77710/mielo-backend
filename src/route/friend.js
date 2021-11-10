const express = require("express");
const router = express.Router();
const User = require("../model/User");
const FriendRequest = require("../model/FriendRequest");
const uid2 = require("uid2");
const isAuthentificated = require("../../middleware/isAuthentificated");
const { findByIdAndDelete } = require("../model/User");

router.post("/friend/new-request", isAuthentificated, async (req, res) => {
  console.log("route : /friend/new-request");
  try {
    const userAskedId = req.fields.userAskedId;
    if (userAskedId) {
      const date = new Date();
      const newFriendRequest = new FriendRequest({
        state: "pending",
        sender: req.user._id,
        receptor: userAskedId,
        date: {
          dateNow: Date.now(),
          year: date.getFullYear(),
          mouth: date.getMonth() + 1,
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes(),
        },
      });
      newFriendRequest.save();

      res.status(200).json({ message: "new request", newFriendRequest: newFriendRequest });
    } else {
      res.status(400).json({ message: "missing the user id asked" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/friend/all-request-received", isAuthentificated, async (req, res) => {
  console.log("route : /friend/all-request-received");
  try {
    const requests = await FriendRequest.find({ receptor: req.user._id }).populate({ path: "sender", select: "_id username profilePicture" });
    res.status(200).json({ message: "all requests received", request: requests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/friend/all-request-sent", isAuthentificated, async (req, res) => {
  console.log("route : /friend/all-request-sent");
  try {
    const requests = await FriendRequest.find({ sender: req.user._id }).populate({ path: "receptor", select: "_id username profilePicture" });
    res.status(200).json({ message: "all requests sent", request: requests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/friend/all-friend", isAuthentificated, async (req, res) => {
  console.log("route : /friend/all-friend");
  try {
    const ids = req.user.friends;
    const friends = await User.find({ _id: { $in: ids } }).select("username profilePicture");
    res.status(200).json({ message: "all friends", friends: friends, numberOfFriends: req.user.numberOfFriends });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/friend/friend-accept/:id", isAuthentificated, async (req, res) => {
  console.log("route : /friend/friend-accept/:id");
  try {
    const id = req.params.id;
    const request = await FriendRequest.findById(id);
    const userSender = await User.findById(request.sender);
    req.user.friends.push(request.sender);
    userSender.friends.push(req.user._id);
    req.user.numberOfFriends++;
    userSender.numberOfFriends++;

    req.user.save();
    userSender.save();
    request.deleteOne();
    res.status(200).json({ message: "request accept" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/friend/friend-refuse/:id", isAuthentificated, async (req, res) => {
  console.log("route : /friend/friend-refuse/:id");
  try {
    const id = req.params.id;
    const request = await FriendRequest.findByIdAndDelete(id);

    res.status(200).json({ message: "request refuse" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/friend/friend-delete/:id", isAuthentificated, async (req, res) => {
  console.log("route : /friend/friend-delete");

  try {
    const id = req.params.id;

    const index = req.user.friends.indexOf(id);
    req.user.friends.splice(index, 1);

    const friendToRemove = await User.findById(id);
    const friendIndexToDelete = friendToRemove.friends.indexOf(req.user._id);
    friendToRemove.friends.splice(friendIndexToDelete, 1);

    req.user.numberOfFriends--;
    friendToRemove.numberOfFriends--;

    req.user.save();
    friendToRemove.save();
    res.status(200).json({ message: "friend deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Post = require("../model/Post");
const Comment = require("../model/Comment");
const isAuthentificated = require("../middleware/isAuthentificated");
const isOwnerComment = require("../middleware/isOwnerComment");
//add the feature to check if the id existe
router.post("/comment/publish/:id", isAuthentificated, async (req, res) => {
  console.log("route : /comment/publish/:id");
  try {
    if (req.fields.text && req.params.id) {
      const id = req.params.id;
      const text = req.fields.text;
      const date = new Date();
      const newComment = new Comment({
        commentOwner: req.user._id,
        post: id,
        commentText: text,
        date: {
          dateNow: Date.now(),
          year: date.getFullYear(),
          mouth: date.getMonth() + 1,
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes(),
        },
      });

      newComment.save();
      res.status(200).json({
        message: "comment added",
        data: newComment,
      });
    } else {
      res.status(400).json({ message: "missing post id or text comment" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/comment/update/:id", isOwnerComment, async (req, res) => {
  console.log("/comment/update/:id");
  try {
    const text = req.fields.text;
    req.comment.commentText = text;
    req.comment.save();
    res.status(200).json({ message: "comment update", data: req.comment });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
router.get("/comment/delete/:id", isOwnerComment, async (req, res) => {
  console.log("/comment/delete/:id");
  try {
    req.comment.deleteOne();
    res.status(200).json({ message: "comment deleted" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/comment/read-all/:id", async (req, res) => {
  console.log("/comment/read-all/:id");
  try {
    const id = req.params.id;
    const comments = await Comment.find({ commentOwner: id });
    if (comments && comments.length > 0) {
      res.status(200).json({ message: "user comments", data: comments });
    } else {
      res.status(200).json({ message: "neither comment found" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});
module.exports = router;

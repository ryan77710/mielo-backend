const User = require("../src/model/User");
const Post = require("../src/model/Post");
const Comment = require("../src/model/Comment");
const isOwnerComment = async (req, res, next) => {
  console.log("test enter");
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });

    if (user) {
      console.log("test finish");
      req.user = user;
      const comment = await Comment.findById(req.params.id);
      if (comment) {
        if (String(comment.commentOwner) === String(user._id)) {
          req.comment = comment;
          return next();
        } else {
          return res
            .status(400)
            .json({ messsage: "Unauthorized you don't owned this comment" });
        }
      } else {
        res.status(400).json({ message: "comment not find" });
      }
    } else {
      res.status(400).json({ messsage: "Unauthorized :((" });
    }
  } else {
    res.status(400).json({ message: "Unauthorized :(" });
  }
};

module.exports = isOwnerComment;

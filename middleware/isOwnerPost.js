const User = require("../src/model/User");
const Post = require("../src/model/Post");
const isOwnerPost = async (req, res, next) => {
  console.log("test enter");
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });

    if (user) {
      console.log("test finish");
      req.user = user;
      const post = await Post.findById(req.params.id);
      if (post) {
        if (String(post.owner) === String(user._id)) {
          req.post = post;
          return next();
        } else {
          return res
            .status(400)
            .json({ messsage: "Unauthorized you don't owned this post" });
        }
      } else {
        res.status(400).json({ message: "post not find" });
      }
    } else {
      res.status(400).json({ messsage: "Unauthorized :((" });
    }
  } else {
    res.status(400).json({ message: "Unauthorized :(" });
  }
};

module.exports = isOwnerPost;

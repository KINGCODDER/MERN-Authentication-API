const Post = require("../Schema/postSchema");

exports.getAllPost = async (req, res) => {
  try {
    const post = await Post.find({}).populate(
      "createdBy comments.sentBy comments.liked",
      "name email mobile"
    );

    res.status(200).json({
      status: "success",
      results: post.length,
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Not found",
      errMessage: err.message,
    });
  }
};

exports.postPost = async (req, res) => {
  try {
    if (!req.user) {
      res.status(403).json({
        status: "fail",
        message: "You are not authorized to add a post",
      });
    }
    const post = await Post.create({ ...req.body, createdBy: req.user });

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Something went wrong",
      errMessage: err.message,
    });
  }
};

exports.editPost = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error();
    }
    const post = await Post.findById(req.params.id);
    if (post.createdBy.toString() !== req.user._id) {
      throw new Error();
    }
    if (!post) {
      throw new Error("Post not available");
    }

    const newPost = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(203).json({ status: "success", message: "Updated the post" });
  } catch (err) {
    res.status(403).json({ status: "fail", message: "You are not authorized" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error();
    }

    const post = await Post.findById(req.params.id);
    console.log();
    if (post.createdBy.toString() !== req.user._id) {
      throw new Error();
    }
    await Post.findByIdAndDelete(req.params.id);

    res.status(203).json({ status: "success", message: "Deleted the post" });
  } catch (err) {
    res.status(403).json({ status: "fail", message: "You are not authorized" });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const token = req.user._id;
    if (!token) {
      throw new Error();
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new Error();
    }
    post.comments.push({ sentBy: req.user._id, sentAt: Date.now() });

    post.save();

    res
      .status(203)
      .json({ status: "success", message: "Commented on the post" });
  } catch (err) {
    res
      .status(404)
      .json({ status: "fail", message: "Post not available to comment" });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const user = req.user._id;

    if (!user) {
      throw new Error();
    }

    const result = await Post.updateOne(
      {
        _id: req.params.id,
        comments: {
          $elemMatch: { _id: req.params.comment },
        },
      },
      {
        $addToSet: { "comments.$.liked": user },
      }
    );

    res.status(203).json({ status: "success", message: "Liked the comment" });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Post not available to like comment",
      errMessage: err.message,
    });
  }
};

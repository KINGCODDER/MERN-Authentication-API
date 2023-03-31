const express = require("express");
const app = express();
const postController = require("../Controller/postController");
const authController = require("../Controller/authController");

const router = express.Router();

router
  .route("/")
  .get(postController.getAllPost)
  .post(authController.validateUser, postController.postPost);

router
  .route("/:id")
  .put(authController.validateUser, postController.editPost)
  .delete(authController.validateUser, postController.deletePost);

router
  .route("/comment/:id")
  .post(authController.validateUser, postController.commentOnPost);

router
  .route("/:id/comment/:comment/like")
  .post(authController.validateUser, postController.likeComment);

module.exports = router;

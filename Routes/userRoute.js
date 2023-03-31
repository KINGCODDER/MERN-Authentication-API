const express = require("express");
const userController = require("../Controller/userController");
const router = express.Router();

router.route("/").post(userController.createUser).get(userController.getUsers);

router
  .route("/:id")
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

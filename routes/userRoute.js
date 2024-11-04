const express = require("express");

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(getAllUsers);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;

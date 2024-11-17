const express = require("express");

const {
  createUser,
  getAllUsers,
  getUser,
  getLogggedInUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");
const AuthService = require("../services/authService");

const router = express.Router();

router.get("/getMe", AuthService.protect, getLogggedInUser, getUser);

router.put(
  "/changePassword/:id",
  AuthService.protect,
  AuthService.allowedTo("admin"),
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  )
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    getAllUsers
  );

router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    getUserValidator,
    getUser
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;

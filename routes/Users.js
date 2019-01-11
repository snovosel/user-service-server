// User routes
import express from "express";
import multer from "multer";

const upload = multer({
  dest: "../uploads"
});

import usersController from "../controllers/Users.js";

import authHandler from "../middlewares/auth.js";

const router = express.Router();

// log in user
// router.post("/login", authHandler.login, usersController.loginUser);
router.post("/login", authHandler.login);

// get all users
router.get("/", usersController.getAllUsers);

// get user by Id
router.get("/:userId", usersController.getUserById);

// create new user
router.post("/", upload.single("image"), usersController.createUser);

//update user
router.patch("/:userId", usersController.updateUser);

// verify if email is taken
router.get("/exist/:userEmail", usersController.isUserEmailTaken);

// set user password
router.patch("/password/:userId", usersController.setUserPassword);

module.exports = router;

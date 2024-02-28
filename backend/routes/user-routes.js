const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../middlewares/authUser");

const usersController = require("../controllers/user-controllers");

router.post("/signup", usersController.signup);
router.post("/login", usersController.login);
router.post("/logout", usersController.logout);
router.get("/getuser",validateUserToken, usersController.checking);
module.exports = router;

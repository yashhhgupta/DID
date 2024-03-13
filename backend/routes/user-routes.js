const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validateUserToken } = require("../middlewares/authUser");

const usersController = require("../controllers/user-controllers");

router.post("/signup", usersController.signup);
router.post("/login", [
    check("email").isEmail(),
    check("password").isLength({ min: 8 })
  ],usersController.login);
router.post("/logout", usersController.logout);
router.get("/get/:userId",validateUserToken, usersController.getUser);
router.post("/fillSurvey", validateUserToken, usersController.fillSurvey);
router.get("/getSurveys/:userId", usersController.getSurveys);
module.exports = router;

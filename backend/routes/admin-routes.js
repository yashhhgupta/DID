const express = require("express");
const router = express.Router();
const { check } = require("express-validator");


const adminController = require("../controllers/admin-controllers");

router.post("/signup", adminController.signupAsAdmin);
router.post("/login", [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 })
  ],adminController.loginAsAdmin);
router.post("/logout", adminController.logout);
module.exports = router;

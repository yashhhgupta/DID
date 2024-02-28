const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin-controllers");

router.post("/signup", adminController.signupAsAdmin);
router.post("/login", adminController.loginAsAdmin);
router.post("/logout", adminController.logout);
module.exports = router;

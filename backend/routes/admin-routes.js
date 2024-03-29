const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validateAdminToken } = require("../middlewares/authAdmin");

const adminController = require("../controllers/admin-controllers");

router.post("/signup", adminController.signupAsAdmin);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  adminController.loginAsAdmin
);
router.post("/logout", adminController.logout);
router.get("/get/:orgId", validateAdminToken, adminController.getOrg);
router.post("/updateProfile", validateAdminToken, adminController.updateOrg);
router.post(
  "/removeEmployee",
  validateAdminToken,
  adminController.removeEmployee
);
router.post(
  "/removeEmployeeTeam",
  validateAdminToken,
  adminController.removeEmployeeTeam
);

router.post("/add-employee", validateAdminToken, adminController.addEmployee);
router.post(
  "/add-employees",
  validateAdminToken,
  adminController.addMultipleEmployees
);
router.get(
  "/getAllUsers/:orgId",
  validateAdminToken,
  adminController.getAllUsers
);
router.get("/getUsersCount/:orgId",validateAdminToken, adminController.getUsersCount);

module.exports = router;

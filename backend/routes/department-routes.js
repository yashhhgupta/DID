const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../middlewares/authUser");
const { validateAdminToken } = require("../middlewares/authAdmin");

const departmentController = require("../controllers/department-controllers");

router.post("/add",validateAdminToken, departmentController.addDepartment);
router.get("/getAll/:orgId", validateUserToken, departmentController.getDepartments);
router.post(
  "/addMultiple",
  validateAdminToken,
  departmentController.addMultipleDepartments
);

module.exports = router;

const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/department-controllers");

router.post("/add", departmentController.addDepartment);
router.post("/getAll", departmentController.getDepartments);

module.exports = router;

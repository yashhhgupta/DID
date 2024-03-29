const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../middlewares/authUser");
const { validateAdminToken } = require("../middlewares/authAdmin");

const diversityController = require("../controllers/diversity-controller");

router.get(
  "/get/:orgId",
  validateUserToken,
  diversityController.getDiversityData
);
router.post(
  "/getScore/:orgId",
  validateUserToken,diversityController.getDiversityScore
);
router.post(
  "/updateDataVisibility",
  validateAdminToken,
  diversityController.updateDataVisibility
);



module.exports = router;

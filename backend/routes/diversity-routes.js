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
router.get(
  "/get/:orgId/:depId",
  validateUserToken,
  diversityController.getDiversityData
);
router.get(
  "/get/:orgId/:depId/:teamId",
  validateUserToken,diversityController.getDiversityData
);
router.get(
  "/getScore/:orgId",
  validateUserToken,diversityController.getDiversityScore
);
router.get(
  "/getScore/:orgId/:depId",
  validateUserToken,diversityController.getDiversityScore
);
router.get(
  "/getScore/:orgId/:depId/:teamId",
  validateUserToken,diversityController.getDiversityScore
);


module.exports = router;

const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../middlewares/authUser");
const { validateAdminToken } = require("../middlewares/authAdmin");

const diversityController = require("../controllers/diversity-controller");

router.get(
  "/get/:orgId",
  diversityController.getDiversityData
);
router.get(
  "/get/:orgId/:depId",
  diversityController.getDiversityData
);
router.get("/get/:orgId/:depId/:teamId", diversityController.getDiversityData);


module.exports = router;

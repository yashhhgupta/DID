const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../middlewares/authUser");
const { validateAdminToken } = require("../middlewares/authAdmin");

const surveyController = require("../controllers/survey-controllers");

router.get("/get/:orgId", validateUserToken ,surveyController.getSurvey);
router.post("/add", validateAdminToken, surveyController.addSurvey);
router.post("/update", validateAdminToken, surveyController.updateSurvey);
router.post("/fillSurvey", validateUserToken, surveyController.fillSurvey);
router.post(
  "/updateResponse",
  validateUserToken,
  surveyController.updateSurveyResponse
);
router.get(
  "/getSurveys/:userId",
  validateUserToken,
  surveyController.getUserSurveys
);

module.exports = router;

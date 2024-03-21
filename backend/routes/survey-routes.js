const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../middlewares/authUser");
const { validateAdminToken } = require("../middlewares/authAdmin");

const surveyController = require("../controllers/survey-controllers");

router.get("/get/:orgId", validateUserToken ,surveyController.getSurvey);
router.post("/add", validateAdminToken, surveyController.addSurvey);
router.post("/multifill", surveyController.multipleSurveyFill);

module.exports = router;

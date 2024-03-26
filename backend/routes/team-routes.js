const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../middlewares/authUser");
const { validateAdminToken } = require("../middlewares/authAdmin");

const teamController = require("../controllers/team-controllers");

router.post("/add", validateAdminToken, teamController.addTeam);
router.get(
  "/getAll/:orgId",
  validateUserToken,
  teamController.getTeams
);
router.post("/addEmployee", validateAdminToken, teamController.addTeamMembers);
router.delete("/delete/:teamId",teamController.deleteTeam);

module.exports = router;

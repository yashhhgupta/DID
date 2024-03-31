const Team = require("../models/team");
const { validationResult } = require("express-validator");
const HttpError = require("../utils/http-error");
const Employee = require("../models/employee");

const addTeam = async (req, res, next) => {
  const { name, orgId, departmentId } = req.body;
  let existingTeam;
  try {
    existingTeam = await Team.findOne({ name: name, orgId: orgId });
  } catch (err) {
    const error = new HttpError(
      "Creating team failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingTeam) {
    const error = new HttpError("Team exists already.", 409);
    return next(error);
  }
  const createdTeam = new Team({
    name,
    orgId,
    departmentId,
  });
  try {
    await createdTeam.save();
  } catch (err) {
    const error = new HttpError(
      "Team creation failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    message: "Team created successfully",
    team: createdTeam.toObject({ getters: true }),
  });
};
const getTeams = async (req, res, next) => {
  let { orgId } = req.params;
  let teams;
  try {
    teams = await Team.find({ orgId: orgId });
  } catch (err) {
    const error = new HttpError(
      "Fetching teams failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!teams) {
    const error = new HttpError("No teams found.", 404);
    return next(error);
  }
  res.status(200).json({
    teams: teams.map((team) => team.toObject({ getters: true })),
  });
};

const addTeamMembers = async (req, res, next) => {
  const { teamId, members } = req.body;
 
  try {
    await Employee.updateMany(
      { _id: { $in: members } },
      { $set: { teamId: teamId } }
    );
  } catch (err) {
    const error = new HttpError(
      "Adding team members failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Team members added successfully" });
};
const deleteTeam = async (req, res, next) => {
  const { teamId } = req.params;
  try {
    await Team.findByIdAndDelete(teamId);
  } catch (err) {
    const error = new HttpError(
      "Deleting team failed, please try again later.",
      500
    );
    return next(error);
  }
  //remove teamId from employees having team id as teamId
  try {
    await Employee.updateMany(
      { teamId: teamId },
      { $unset: { teamId: 1 } },
      { multi: true }
    );
  } catch (err) {
    const error = new HttpError(
      "Deleting team failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Team deleted successfully" });
};

exports.addTeam = addTeam;
exports.getTeams = getTeams;
exports.addTeamMembers = addTeamMembers;
exports.deleteTeam = deleteTeam;

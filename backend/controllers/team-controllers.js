const Team = require('../models/team');
const { validationResult } = require('express-validator');
const HttpError = require('../utils/http-error');
const Employee = require('../models/employee');

const addTeam = async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { name, orgId, departmentId, diversityGoalScore } = req.body;
    let existingTeam;
    try {
        existingTeam = await Team.findOne({ name: name, orgId: orgId });
    }
    catch (err) {
        const error = new HttpError(
            'Creating team failed, please try again later.',
            500
        );
        return next(error);
    }
    if (existingTeam) {
        const error = new HttpError('Team exists already.', 422);
        return next(error);
    }
    const createdTeam = new Team({
        name,
        orgId,
        departmentId,
        diversityGoalScore,
    });
    try {
        await createdTeam.save();
    }
    catch (err) {
        const error = new HttpError(
            'Team creation failed, please try again later.',
            500
        );
        return next(error);
    }
    res
        .status(201)
        .json({
            message: 'Team created successfully',
            team: createdTeam.toObject({ getters: true }),
        });
    
}
const getTeams = async (req, res,next) => { 
    let { orgId } = req.params;
    let teams;
    try {
        teams = await Team.find({ orgId: orgId });
    }
    catch (err) {
        const error = new HttpError(
            'Fetching teams failed, please try again later.',
            500
        );
        return next(error);
    }
    if (!teams) {
        const error = new HttpError('No teams found.', 404);
        return next(error);
    }
    res.json({
        teams: teams.map((team) =>
            team.toObject({ getters: true })
        ),
    });
}

const addTeamMembers = async (req, res,next) => {
    const { teamId, members } = req.body;
    if (!members || members.length === 0) {
        const error = new HttpError(
            'Please select atleast one employee',
            422
        );
        return next(error);
    }
    try {
        await Employee.updateMany(
            { _id: { $in: members } },
            { $set: { teamId: teamId } }
        );
    }
    catch (err) {
        const error = new HttpError(
            'Adding team members failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ message: 'Team members added successfully' });
}
const deleteTeam = async (req, res, next) => {
    const { teamId } = req.params;
    try {
        await Team.findByIdAndDelete(teamId);
    }
    catch (err) {
        console.log(err);
        const error = new HttpError(
            'Deleting team failed, please try again later.',
            500
        );
        return next(error);
    }
    //remove teamId from employees having team id as teamId
    try {
        await Employee.updateMany
            ({ teamId: teamId },
                { $unset: { teamId: 1 } },
                { multi: true }
        );  
    }
    catch (err) {
        const error = new HttpError(
            console.log(err),
            'Deleting team failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({ message: 'Team deleted successfully' });
}


exports.addTeam = addTeam;
exports.getTeams = getTeams;
exports.addTeamMembers = addTeamMembers;
exports.deleteTeam = deleteTeam;

const HttpError = require("../utils/http-error");
const { validationResult } = require("express-validator");
const { diversityPipeline } = require("../utils/pipeline");
const { diversityScorePipeline } = require("../utils/pipeline/temp");
const { calculateDiversityScore } = require("../utils/score");
const { TIMERANGE } = require("../utils");


const Employee = require("../models/employee");
const Org = require("../models/organization");
const getDiversityData = async (req, res, next) => {
    let { orgId,depId,teamId } = req.params;
    if (!depId) {
        depId = undefined;
    }
    if (!teamId) {
      teamId = undefined;
    }
    // console.log(diversityPipeline(orgId, depId, teamId));
    let diversityData;  
    try {
        diversityData = await Employee.aggregate(
          diversityPipeline(orgId,depId,teamId)
        );
    }
    catch (err) {
        console.log(err);
        const error = new HttpError("Fetching diversity data failed, please try again later.", 500);
        return next(error);
    }
    if (!diversityData) {
        const error = new HttpError("No diversity data found.", 404);
        return next(error);
    }
    res.json({ diversityData: diversityData });
};
const getDiversityScore = async (req, res, next) => {
    let { orgId, depId, teamId } = req.params;
    if (!depId) {
      depId = undefined;
    }
    if (!teamId) {
      teamId = undefined;
    }
    let diversityData;
    let weightage;
    try {
        weightage = await Org.findById(orgId).select("weightage");
    }
    catch (err) {
        console.log(err);
        const error = new HttpError("Fetching weightage failed, please try again later.", 500);
        return next(error);
    }
    if (!weightage) {
        const error = new HttpError("No weightage found.", 404);
        return next(error);
    }
    let score = [];
    for (let i = 0; i < TIMERANGE.length; i++) {
        diversityData = await Employee.aggregate(diversityScorePipeline(orgId,
            TIMERANGE[i].start,
            TIMERANGE[i].end,
            depId,
            teamId
        ));
        score.push({
            label: TIMERANGE[i].label,
            score: calculateDiversityScore(diversityData, weightage.weightage)
        });
    }
    res.json({ diversityData: score });
}
exports.getDiversityData = getDiversityData;
exports.getDiversityScore = getDiversityScore;

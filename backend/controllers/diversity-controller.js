const HttpError = require("../utils/http-error");
const { diversityPipeline } = require("../utils/pipeline/diveristyData");
const { diversityScorePipeline } = require("../utils/pipeline/diversityScore");
const { calculateDiversityScore } = require("../utils/score");
const { TIMERANGE } = require("../utils");


const Employee = require("../models/employee");
const Org = require("../models/organization");
const getDiversityData = async (req, res, next) => {
    let { orgId } = req.params;
    let { current, depId, teamId } = req.query;
    
    let org;
    try {
        org = await Org.findById(orgId);
    }
    catch (err) { 
        console.log(err);
        const error = new HttpError("Fetching organization failed, please try again later.", 500);
        return next(error);
    }
    if (!org) { 
        const error = new HttpError("No organization found.", 404);
        return next(error);
    }
    // console.log(diversityPipeline(orgId, depId, teamId));
    let diversityData;  
    try {
        diversityData = await Employee.aggregate(
          diversityPipeline(orgId,depId,teamId,current)
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
    res.json({ diversityData: diversityData , dataVisibility: org.dataVisibility});
};
const getDiversityScore = async (req, res, next) => {
    let { orgId } = req.params;
    let { depId, teamId } = req.query;
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

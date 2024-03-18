const HttpError = require("../utils/http-error");
const { validationResult } = require("express-validator");
const { diversityPipeline } = require("../pipeline");
const Employee = require("../models/employee");
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
exports.getDiversityData = getDiversityData;

const HttpError = require("../utils/http-error");
const { validationResult } = require("express-validator");
const { diversityPipeline } = require("../pipeline");
const Employee = require("../models/employee");
const getDiversityData = async (req, res, next) => {
    const orgId = req.params.orgId;
    let diversityData;  
    try {
        diversityData = await Employee.aggregate(diversityPipeline(orgId));
    }
    catch (err) {
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

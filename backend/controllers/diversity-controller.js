const HttpError = require("../utils/http-error");
const { diversityPipeline } = require("../utils/pipeline/diveristyData");
const { diversityScorePipeline } = require("../utils/pipeline/diversityScore");
const { calculateDiversityScore } = require("../utils/score");

const Employee = require("../models/employee");
const Org = require("../models/organization");
const getDiversityData = async (req, res, next) => {
  let { orgId } = req.params;
  let { current, depId, teamId } = req.query;
  let org;
  try {
    org = await Org.findById(orgId);
  } catch (err) {
    const error = new HttpError(
      "Fetching organization failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!org) {
    const error = new HttpError("No organization found.", 404);
    return next(error);
  }
  let diversityData;
  try {
    diversityData = await Employee.aggregate(
      diversityPipeline(orgId, depId, teamId, current)
    );
  } catch (err) {
    console.log("errrr",err);
    const error = new HttpError(
      "Fetching diversity data failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!diversityData) {
    const error = new HttpError("No diversity data found.", 404);
    return next(error);
  }
  res
    .status(200)
    .json({ diversityData: diversityData, dataVisibility: org.dataVisibility });
};
const getDiversityScore = async (req, res, next) => {
  let { orgId } = req.params;
  let { depId, teamId } = req.query;
  let { startYear, endYear } = req.body;

  let diversityData;
  let weightage;
  if (!startYear && !endYear) {
    startYear = new Date("2015-01-01");
    endYear = new Date("2024-04-01");
  } else {
    startYear = new Date(startYear);
    endYear = new Date(endYear);
  }
  try {
    weightage = await Org.findById(orgId).select("weightage");
  } catch (err) {
    const error = new HttpError(
      "Fetching weightage failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!weightage) {
    console.log("No weightage found");
    const error = new HttpError("No weightage found.", 404);
    return next(error);
  }
  let score = [];
  //check for each year from starting year to ending year
  for (let i = startYear.getFullYear(); i <= endYear.getFullYear(); i++) {
    for (let j = 0; j < 4; j++) {
      let start = new Date(i, j * 3, 1);
      let end = new Date(i, (j + 1) * 3, 0);
      try {
        diversityData = await Employee.aggregate(
          diversityScorePipeline(orgId, start, end, depId, teamId)
        );
      } catch (err) { 
        const error = new HttpError(
          "Fetching diversity data failed, please try again later.",
          500
        );
        return next(error);
      }
      //set label as quarter number
      
      score.push({
        label: i + "-Q" + (j + 1),
        score: calculateDiversityScore(diversityData, weightage.weightage),
      });
    }
  }
  return res.status(200).json({ diversityData: score });
};

const updateDataVisibility = async (req, res, next) => {
  const { orgId, field, visibility } = req.body;

  try {
    const updatedOrg = await Org.findByIdAndUpdate(
      orgId,
      {
        $set: { [`dataVisibility.${field}`]: visibility },
      },
      { new: true }
    );

    if (!updatedOrg) {
      const error = new HttpError("No organization found", 404);
      return next(error);
    }

    res.status(200).json({ message: "Visibility Updated" });
  } catch (err) {
    const error = new HttpError(
      "Updating organization failed, please try again later.",
      500
    );
    return next(error);
  }
};
exports.getDiversityData = getDiversityData;
exports.getDiversityScore = getDiversityScore;
exports.updateDataVisibility = updateDataVisibility;

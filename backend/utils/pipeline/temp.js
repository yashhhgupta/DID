const mongoose = require("mongoose");

const diversityScorePipeline = (orgId, startDate, endDate, depId, teamId) => {
  const matchStage = {
    $match: {
      orgId: new mongoose.Types.ObjectId(orgId),
      dateOfJoining: { $lte: startDate },
      $or: [{ dateOfLeaving: null }, { dateOfLeaving: { $gte: endDate } }],
    },
  };
  if (depId) {
    matchStage.$match.departmentId = new mongoose.Types.ObjectId(depId);
    if (teamId) {
      matchStage.$match.teamId = new mongoose.Types.ObjectId(teamId);
    }
  }
  return [
    matchStage,
    {
      $facet: {
        gender: [
          {
            $group: {
              _id: "$gender",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              gender: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
        sexualOrientation: [
          {
            $group: {
              _id: "$sexualOrientation",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              sexualOrientation: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
        disabilityStatus: [
          {
            $group: {
              _id: "$disabilityStatus",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              disabilityStatus: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
        married: [
          {
            $group: {
              _id: "$married",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              married: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
        parentalStatus: [
          {
            $group: {
              _id: "$parentalStatus",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              parentalStatus: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
        religion: [
          {
            $group: {
              _id: "$religion",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              religion: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
        ethnicity: [
          {
            $group: {
              _id: "$ethnicity",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              ethnicity: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
        geographicalLocation: [
          {
            $group: {
              _id: "$geographicalLocation",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              geographicalLocation: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
        workExperience: [
          {
            $group: {
              _id: "$workExperience",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              workExperience: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
        generationalDiversity: [
          {
            $group: {
              _id: "$generationalDiversity",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              generationalDiversity: "$_id",
              count: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        diversityData: {
          $objectToArray: "$$ROOT",
        },
      },
    },
    {
      $unwind: "$diversityData",
    },
    {
      $replaceRoot: { newRoot: "$diversityData" },
    },
  ];
};

exports.diversityScorePipeline = diversityScorePipeline;

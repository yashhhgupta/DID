const Survey = require("../models/survey");
const Employee = require("../models/employee");

const { validationResult } = require("express-validator");
const HttpError = require("../utils/http-error");
const { all } = require("../routes/survey-routes");

const getSurvey = async (req, res, next) => {
  const { orgId } = req.params;
  let surveys;
  try {
    surveys = await Survey.find({ orgId: orgId });
  } catch (err) {
    const error = new HttpError(
      "Fetching surveys failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    surveys: surveys.map((survey) => survey.toObject({ getters: true })),
  });
};

const addSurvey = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const date = new Date();
  const { title, description, orgId, deadline, questions } = req.body;
  const createdSurvey = new Survey({
    title,
    description,
    orgId,
    createdOn: date,
    deadline,
    countOfUsersFilled: 0,
    inclusionScore: 0,
    questions,
  });
  try {
    // console.log(createdSurvey);
    await createdSurvey.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Survey creation failed, please try again later.",
      500
    );
    return next(error);
  }
  res
    .status(201)
    .json({
      message: "Survey created successfully",
      survey: createdSurvey.toObject({ getters: true }),
    });
};

const multipleSurveyFill = async (req, res, next) => {
  const { surveyId, userIds } = req.body;
  //in all the employees push a object containing surveyId radndom score in the surveyReesponses array
  let employees;
  try {
    employees = await Employee.find({ _id: { $in: userIds } });
  } catch (err) {
    const error = new HttpError(
      "Fetching employees failed, please try again later.",
      500
    );
    return next(error);
  }
  let sum = 0;
  employees.forEach(async (employee) => {
    let random = Math.floor(Math.random() * 100 + 1);
    sum += random;
    employee.surveyResponses.push({ surveyId: surveyId, score: random });
    try {
      await employee.save();
    } catch (err) {
      const error = new HttpError(
        "Survey filling failed, please try again later.",
        500
      );
      return next(error);
    }
  });
  //update the survey count of users filled and the inclusion score
  let survey;
  try {
    survey = await Survey.findById(surveyId);
  } catch (err) {
    const error = new HttpError(
      "Fetching survey failed, please try again later.",
      500
    );
    return next(error);
  }
  survey.countOfUsersFilled += employees.length;
  survey.inclusionScore =
    (survey.inclusionScore * (survey.countOfUsersFilled - employees.length) +
      sum) /
    survey.countOfUsersFilled;
  try {
    await survey.save();
  } catch (err) {
    const error = new HttpError(
      "Survey filling failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({ message: "Survey filled successfully" });
};

exports.getSurvey = getSurvey;
exports.addSurvey = addSurvey;
exports.multipleSurveyFill = multipleSurveyFill;

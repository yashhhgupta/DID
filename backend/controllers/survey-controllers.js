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
const updateSurvey = async (req, res, next) => {
  const { id, title, description, deadline, questions,allowResubmit } = req.body;
  let survey;
  try {
    survey = await Survey.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Fetching survey failed, please try again later.",
      500
    );
    return next(error);
  }
  survey.title = title;
  survey.description = description;
  survey.deadline = deadline;
  survey.questions = questions;
  survey.allowResubmit = allowResubmit;
  try {
    await survey.save();
  } catch (err) {
    const error = new HttpError(
      "Survey updation failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ message: "Survey updated successfully" });
}

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

const getSurveys = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      res.json({ surveys: user.surveyResponses });
    })
    .catch((err) => {
      const error = new HttpError(
        "Fetching surveys failed, please try again later.",
        500
      );
      return next(error);
    });
};

const updateSurveyResponse = async (req, res, next) => {
  const { userId, surveyId, score } = req.body;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Cant find User, please try again later.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("User not found", 404);
    return next(error);
  }

  let existingSurvey;
  try {
    existingSurvey = await Survey.findById(surveyId);
  } catch (err) {
    const error = new HttpError(
      "Cant find Survey, please try again later.",
      500
    );
    return next(error);
  }
  if (!existingSurvey) {
    const error = new HttpError("Survey not found", 404);
    return next(error);
  }
  let prevScore = user.surveyResponses.find(
    (survey) => survey.surveyId == surveyId
  ).score;
  //update survey score in user surveyResponses array and in survey model same as fillSurvey
  user.surveyResponses.map((survey) => {
    if (survey.surveyId == surveyId) survey.score = score;
  });
  existingSurvey.inclusionScore =
    (existingSurvey.inclusionScore * existingSurvey.countOfUsersFilled -
      prevScore +
      score) /
    existingSurvey.countOfUsersFilled;

  try {
    await user.save();
    await existingSurvey.save();
  } catch (err) {
    const error = new HttpError(
      "Updating survey failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ message: "Survey updated" });
};
const fillSurvey = async (req, res, next) => {
  const { userId, surveyId, score } = req.body;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Cant find User, please try again later.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("User not found", 404);
    return next(error);
  }
  //if user has already filled the survey then return
  let survey = user.surveyResponses.find(
    (survey) => survey.surveyId == surveyId
  );
  if (survey) {
    const error = new HttpError("Survey already filled", 400);
    return next(error);
  }
  user.surveyResponses.push({ surveyId: surveyId, score: score });
  let existingSurvey;
  try {
    existingSurvey = await Survey.findById(surveyId);
  } catch (err) {
    const error = new HttpError(
      "Cant update Survey Score, please try again later.",
      500
    );
    return next(error);
  }
  if (!existingSurvey) {
    const error = new HttpError("Survey not found", 404);
    return next(error);
  }
  existingSurvey.countOfUsersFilled += 1;
  existingSurvey.inclusionScore =
    (existingSurvey.inclusionScore * (existingSurvey.countOfUsersFilled - 1) +
      score) /
    existingSurvey.countOfUsersFilled;

  try {
    await user.save();
    await existingSurvey.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Filling survey failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ message: "Survey filled successfully" });
};

exports.getSurvey = getSurvey;
exports.addSurvey = addSurvey;
exports.multipleSurveyFill = multipleSurveyFill;
exports.updateSurvey = updateSurvey;
exports.getSurveys = getSurveys;
exports.fillSurvey = fillSurvey;
exports.updateSurveyResponse = updateSurveyResponse;
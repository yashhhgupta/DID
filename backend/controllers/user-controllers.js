const HttpError = require("../utils/http-error");
const User = require("../models/employee");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Survey = require("../models/survey");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  // console.log(req.body);
  const { firstname, email, password, orgId, departmentId, dateOfJoining } =
    req.body;

  //   console.log(req.body);
  let existingEmail;
  try {
    existingEmail = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    console.log(err);
    return next(error);
  }

  if (existingEmail) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    firstname: firstname,
    email: email,
    password: password,
    orgId: orgId,
    departmentId: departmentId,
    dateOfJoining: dateOfJoining,
  });
  try {
    await createdUser.save();
    // console.log(newuser,'no new user error')
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Login failed, check your credentials or signup.",
      500
    );
    return next(error);
  }
  if (!existingUser) {
    // console.log(password,existingUser.password)

    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    res.json(existingUser);

    return next(error);
  } else {
    if (existingUser.dateOfLeaving !== undefined) {
      const error = new HttpError("User has left the organization", 401);
      return next(error);
    }

    let pass = await bcrypt.compare(password, existingUser.password);

    if (!pass) {

      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        401
      );
      return next(error);
    }
  }
  delete existingUser.password;
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, role: "User" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    // lo;
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  // console.log(existingUser.id + " " + "possible?");
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);

  res.cookie("token", token, { expires: expirationDate });

  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    orgId: existingUser.orgId,
    token: token,
  });
  // res.json({message:"Logged in", user: existingUser.toObject({ getters: true }) });
};

const logout = async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

const updatePassword = async (req, res, next) => {
  const { userId, oldPassword, newPassword } = req.body;
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
  let pass = await bcrypt.compare(oldPassword, user.password);
  if (!pass) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }
  user.password = newPassword;
  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Could not update password, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ message: "Password updated" });
};

const getUser = async (req, res, next) => {
  const userId = req.params.userId;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("User not found", 404);
    return next(error);
  }
  res.json({ user: user.toObject({ getters: true }) });
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

const updateProfile = async (req, res, next) => {
  const { userId, datatoUpdate } = req.body;
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
  //update certain fields of user given in dateToUpdate
  for (let key in datatoUpdate) {
    user[key] = datatoUpdate[key];
  }
  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Updating user failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ message: "User updated" });
};

exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.fillSurvey = fillSurvey;
exports.getSurveys = getSurveys;
exports.getUser = getUser;
exports.updateProfile = updateProfile;
exports.updateSurveyResponse = updateSurveyResponse;
exports.updatePassword = updatePassword;

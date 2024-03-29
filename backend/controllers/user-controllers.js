const HttpError = require("../utils/http-error");
const User = require("../models/employee");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");


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
    const error = new HttpError("User not found", 401);
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
  res.status(200).json({ message: "Password updated" });
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
    const error = new HttpError("User not found", 401);
    return next(error);
  }
  res.status(200).json({ user: user});
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
    const error = new HttpError("User not found", 401);
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
  res.status(200).json({ message: "Profile updated" });
};

exports.login = login;
exports.logout = logout;
exports.getUser = getUser;
exports.updateProfile = updateProfile;
exports.updatePassword = updatePassword;

const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422)
      );
    }
    // console.log(req.body);
    const { name, email, password } = req.body;
  
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
      name: name,
      email: email,
      password: password,
    });
    try {
      const newuser = await createdUser.save();
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
      const pass = await bcrypt.compare(password, existingUser.password);
      // console.log(pass)
      if (!pass) {
        const error = new HttpError(
          "Invalid credentials, could not log you in.",
          401
        );
        return next(error);
      }
    }
    res.json({message:"Logged in", user: existingUser.toObject({ getters: true }) });
  };

exports.signup = signup;
exports.login = login;
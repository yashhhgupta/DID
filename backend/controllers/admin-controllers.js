const HttpError = require("../utils/http-error");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Org = require("../models/organization");
const User = require("../models/employee");
const Department = require("../models/department");
const mongoose = require("mongoose");

const signupAsAdmin = async (req, res, next) => {
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
    existingEmail = await Org.findOne({ email: email });
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

  const createdOrg = new Org({
    name: name,
    email: email,
    password: password,
    weightage: {
      gender: 10,
      sexualOrientation: 10,
      ethnicity: 10,
      disabilityStatus: 10,
      married: 10,
      parentalStatus: 10,
      religion: 10,
      geographicalLocation: 10,
      workExperience: 10,
      generationalDiversity: 10,
    },
    dataVisibility: {
      diversityScore: true,
      gender: true,
      sexualOrientation: true,
      ethnicity: true,
      disabilityStatus: true,
      married: true,
      parentalStatus: true,
      religion: true,
      geographicalLocation: true,
      workExperience: true,
      generationalDiversity: true,
    },
  });
  try {
    await createdOrg.save();
    // console.log(newuser,'no new user error')
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ message: "Admin created successfully" });
};

const loginAsAdmin = async (req, res, next) => {
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
    existingUser = await Org.findOne({ email: email });
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
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, role: "Admin" },
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
    orgId: existingUser._id,
    token: token,
  });
};
const logout = async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
const getOrg = async (req, res, next) => {
  const orgId = req.params.orgId;
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
    const error = new HttpError("No organization found", 404);
    return next(error);
  }
  res.json({ org: org.toObject({ getters: true }) });
};
const updateOrg = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { orgId, dataToUpdate } = req.body;
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
    const error = new HttpError("No organization found", 404);
    return next(error);
  }
  for (let key in dataToUpdate) {
    org[key] = dataToUpdate[key];
  }
  try {
    await org.save();
  } catch (err) {
    const error = new HttpError(
      "Updating organization failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ org: org.toObject({ getters: true }) });
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
    console.error("Error:", err);
    const error = new HttpError(
      "Updating organization failed, please try again later.",
      500
    );
    return next(error);
  }
};

const addEmployee = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  // console.log(req.body);
  const { firstname, email, orgId, departmentId } = req.body;

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
    password: "12345678",
    orgId: orgId,
    departmentId: departmentId,
    dateOfJoining: new Date(),
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
const addMultipleEmployees = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const employees = req.body.employees;
  const orgId = req.body.orgId;

  try {
    // Fetch department ids based on department names with orgId
    const departmentNames = employees.map((employee) => employee.department);
    const departments = await Department.find(
      { name: { $in: departmentNames }, orgId: orgId },
      "name id"
    );

    // Map department names to department ids
    const departmentMap = departments.reduce((map, dep) => {
      map[dep.name] = dep.id;
      return map;
    }, {});

    //if employee already exists, dont add the employee
    await Promise.all(
      employees.map(async (employee) => {
        const existingEmployee = await User.findOne({
          email: employee.email,
          orgId: orgId,
        });
        if (existingEmployee) {
          const index = employees.indexOf(employee);
          employees.splice(index, 1);
        }
      })
    );

    // Update employee objects with department ids
    // console.log(departmentMap);
    // const salt = await bcrypt.genSalt(10);
    // const pass = await bcrypt.hash("12345678", salt);
    const pass = "12345678";
    await Promise.all(
      employees.map(async (employee) => {
        if (!employee.dateOfJoining) {
          employee.dateOfJoining = new Date();
        } else {
          employee.dateOfJoining = new Date(employee.dateOfJoining);
        }

        if (employee.dateOfLeaving) {
          employee.dateOfLeaving = new Date(employee.dateOfLeaving);
        }

        employee.orgId = orgId;
        employee.departmentId = departmentMap[employee.department];

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(pass, salt);
        // employee.password = pass;
      })
    );
    // Insert employees into the database
    // console.log(employees);
    await User.insertMany(employees);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Adding employees failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "Employees added successfully" });
};
const getAllUsers = async (req, res, next) => {
  const { orgId } = req.params;
  let users;
  try {
    users = await User.find({ orgId: orgId });
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!users) {
    const error = new HttpError("No users found", 404);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUsersCount = async (req, res, next) => {
  const { orgId } = req.params;
  let count;
  try {
    count = await User.countDocuments({ orgId: orgId,
     });
    res.json({ count: count });
  } catch (err) {
    const error = new HttpError(
      "Fetching users count failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.signupAsAdmin = signupAsAdmin;
exports.loginAsAdmin = loginAsAdmin;
exports.logout = logout;
exports.addEmployee = addEmployee;
exports.addMultipleEmployees = addMultipleEmployees;
exports.getAllUsers = getAllUsers;
exports.getUsersCount = getUsersCount;
exports.getOrg = getOrg;
exports.updateOrg = updateOrg;
exports.updateDataVisibility = updateDataVisibility;

const HttpError = require("../utils/http-error");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Org = require("../models/organization");
const User = require("../models/employee");
const Department = require("../models/department");
const mongoose = require("mongoose");

const signupAsAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingEmail;
  try {
    existingEmail = await Org.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingEmail) {
    const error = new HttpError(
      "User exists already, please login instead.",
      409
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
  } catch (err) {
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
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );

    return next(error);
  } else {
    const pass = await bcrypt.compare(password, existingUser.password);
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
  res.json({ message: "Admin logged out" });
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
  res.status(200).json({ org: org });
};
const updateOrg = async (req, res, next) => {
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
      "Updating organization(saving) failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ org: org, message: "Organization updated successfully" });
};

const addEmployee = async (req, res, next) => {
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
    return next(error);
  }

  if (existingEmail) {
    const error = new HttpError(
      "User exists already, please login instead.",
      409
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
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ message: "Employee added successfully" });
};
const addMultipleEmployees = async (req, res, next) => {
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

    await User.insertMany(employees);
  } catch (err) {
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
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUsersCount = async (req, res, next) => {
  const { orgId } = req.params;
  let count;
  try {
    count = await User.countDocuments({ orgId: orgId });
    res.json({ count: count });
  } catch (err) {
    const error = new HttpError(
      "Fetching users count failed, please try again later.",
      500
    );
    return next(error);
  }
};
const removeEmployee = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { dateOfLeaving: new Date() } },
      { new: true }
    ).lean();
    if (!user) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Removing employee failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({ message: "Employee removed successfully" });
};
const removeEmployeeTeam = async (req, res, next) => {
  const { userId } = req.body;
  
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $unset: { teamId: 1 } },
      { new: true }
    ).lean();

    if (!user) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Removing employee team failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({ message: "Employee removed from team removed successfully" });
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
exports.removeEmployee = removeEmployee;
exports.removeEmployeeTeam = removeEmployeeTeam;

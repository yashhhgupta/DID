const Department = require("../models/department");
const { validationResult } = require("express-validator");
const HttpError = require("../utils/http-error");

const addDepartment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, orgId, diversityGoalScore } = req.body;
  let existingDepartment;
  try {
    existingDepartment = await Department.findOne({ name: name, orgId: orgId });
  } catch (err) {
    const error = new HttpError(
      "Creating department failed, please try again later.",
      500
    );
    return res.status(500).json({ message: "Creating department failed, please try again later." });
  }
  if (existingDepartment) {
    const error = new HttpError("Department exists already.", 500);
    return res.status(500).json({ message: "Department exists already." });
  }
  const createdDepartment = new Department({
    name,
    orgId,
    diversityGoalScore,
  });
  try {
    await createdDepartment.save();
    // console.log(newuser,'no new user error')
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Department creation failed, please try again later.",
      500
    );
    return next(error);
  }
  res
    .status(201)
    .json({
      message: "Department created successfully",
      department: createdDepartment.toObject({ getters: true }),
    });
};
const addMultipleDepartments = async (req, res, next) => { 
  const { departments, orgId } = req.body;
  console.log(departments, orgId);
  let existingDepartment;
  let createdDepartments = [];
  try {
    for (let i = 0; i < departments.length; i++) {
      existingDepartment = await Department.findOne({
        name: departments[i],
        orgId: orgId,
      });
      if (existingDepartment) {
        const error = new HttpError("Department exists already.", 500);
        return res.status(500).json({ message: "Department exists already." });
      }
      const createdDepartment = new Department({
        name: departments[i],
        orgId: orgId,
      });
      createdDepartments.push(createdDepartment);
    }
    await Department.insertMany(createdDepartments);
  } catch (err) {
    const error = new HttpError(
      "Department creation failed, please try again later.",
      500
    );
    return next(error);
  }
  res
    .status(201)
    .json({
      message: "Departments created successfully",
      departments: createdDepartments.map((department) =>
        department.toObject({ getters: true })
      ),
    });
}


const getDepartments = async (req, res, next) => {
  let { orgId } = req.params;
  let departments;
  try {
    departments = await Department.find({ orgId: orgId });
  } catch (err) {
    const error = new HttpError(
      "Fetching departments failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!departments) {
    const error = new HttpError("No departments found.", 404);
    return next(error);
  }
  res.json({
    departments: departments.map((department) =>
      department.toObject({ getters: true })
    ),
  });
};

exports.addDepartment = addDepartment;
exports.getDepartments = getDepartments;
exports.addMultipleDepartments = addMultipleDepartments;

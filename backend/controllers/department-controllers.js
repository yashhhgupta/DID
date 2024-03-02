const Department = require('../models/department');
const { validationResult } = require("express-validator");
const HttpError = require("../utils/http-error");


const addDepartment = async (req, res,next) => { 
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
    }
    catch (err) {
        const error = new HttpError(
            "Creating department failed, please try again later.",
            500
        );
        return next(error);
    }
    if (existingDepartment) {
      const error = new HttpError(
        "Department exists already.",
        422
      );
      return next(error);
    }
    const createdDepartment = new Department({
      name,
      orgId,
      diversityGoalScore
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
      .json({message:"Department created successfully", department: createdDepartment.toObject({ getters: true }) });
}
exports.addDepartment = addDepartment;
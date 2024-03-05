const Survey = require('../models/survey');

const { validationResult } = require("express-validator");
const HttpError = require("../utils/http-error");

const getSurvey = async (req, res, next) => {
    const {orgId} = req.body;
    let surveys;
    try {
        surveys = await Survey.find({orgId: orgId});
    } catch (err) {
        const error = new HttpError(
            "Fetching surveys failed, please try again later.",
            500
        );
        return next(error);
    }
    res.json({ surveys: surveys.map(survey => survey.toObject({ getters: true })) });
}

const addSurvey = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }
    const date = new Date();
    const { title,description, orgId,deadline, questions } = req.body;
    const createdSurvey = new Survey({
        title,
        description,
        orgId,
        createdOn: date,
        deadline,
        questions
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
        .json({ message: "Survey created successfully", survey: createdSurvey.toObject({ getters: true }) });
 }

exports.getSurvey = getSurvey;
exports.addSurvey = addSurvey;  
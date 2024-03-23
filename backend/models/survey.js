const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    orgId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Organization",
    },
    createdOn: {
        type: Date,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    inclusionScore: {
        type: Number,
    },
    countOfUsersFilled: {
        type: Number,
    },
    allowResubmit:{
        type: Boolean,
        default: false,
    },
    questions: []
});
module.exports = mongoose.model("Survey", surveySchema);
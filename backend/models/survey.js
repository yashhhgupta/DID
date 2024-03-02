const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema({
    name: {
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
    questions: [{
        type: mongoose.Types.ObjectId,
        ref: "Question",
    }]
});
module.exports = mongoose.model("Survey", surveySchema);
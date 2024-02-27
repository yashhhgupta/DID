const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    name: { type: String, required: true },
    diversityGoalScore: { type: Number },
})

module.exports = mongoose.model("Organization", organizationSchema);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name: { type: String, required: true },
    orgId: { type: mongoose.Types.ObjectId, required: true, ref: "Organization" },
    diversityGoalScore: { type: Number},
});

module.exports = mongoose.model("Department", departmentSchema);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: { type: String, required: true },
    orgId: { type: mongoose.Types.ObjectId, required: true, ref: "Organization" },
    departmentId: { type: mongoose.Types.ObjectId, required: true, ref: "Department" },
  diversityGoalScore: { type: Number },
});

module.exports = mongoose.model("Team", teamSchema);

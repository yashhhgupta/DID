const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const employeeSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  departmentId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Department",
  },
  teamId: {
    type: mongoose.Types.ObjectId,
    ref: "Team",
  },
  orgId: {
    type: mongoose.Types.ObjectId,
    ref: "Organization",
  },
  dateOfJoining: { type: Date, required: true },
  dateOfLeaving: { type: Date },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: [
      "Male",
      "Female",
      "Non-binary",
      "Transgender",
      "Other",
      "Prefer not to say",
    ],
  },
  sexualOrientation: {
    type: String,
    enum: [
      "Heterosexual",
      "Homosexual",
      "Bisexual",
      "Other",
      "Prefer not to say",
    ],
  },
  ethnity: {
    type: String,
    enum: [
      "White",
      "Black",
      "Asian",
      "Middle Eastern",
      "Latin",
      "Other",
      "Prefer not to say",
    ],
  },
  disabilityStatus: {
    type: String,
    enum: ["Yes", "No", "Prefer not to say"],
  },
  married: {
    type: String,
    enum: ["Single", "Married", "Divorced"],
  },
  parentalStatus: {
    type: String,
    enum: ["Parent", "Non-parent", "Expeing"],
  },
  religion: {
    type: String,
    enum: [
      "Christianity",
      "Islam",
      "Hinduism",
      "Buddhism",
      "Sikhism",
      "Atheist",
      "Other",
    ],
  },
  geographicalLocation: {
    type: String,
    enum: ["Urban", "Suburban", "Rural"],
  },
  workExperience: {
    type: String,
    enum: ["Entry level", "Mid level", "Senior level"],
  },
  generationalDiversity: {
    type: String,
    enum: ["Boomers", "Generation X", "Millenial", "Generation Z"],
  },
});

const SALT_WORK_FACTOR = 10;
employeeSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

module.exports = mongoose.model("Employee", employeeSchema);

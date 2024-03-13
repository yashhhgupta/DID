const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const employeeSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true},
  password: { type: String, required: true, minlength: 6 },
  orgId: {
    type: mongoose.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  departmentId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Department",
  },
  dateOfJoining: { type: Date, required: true },
  teamId: {
    type: mongoose.Types.ObjectId,
    ref: "Team",
  },

  dateOfLeaving: { type: Date },
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
  ethnicity: {
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
    enum: ["Boomers", "Generation X", "Millennials", "Generation Z"],
  },
  //will contain the survey responses of the employee in the form of an array of objects of survey id and score of the survey
  surveyResponses: [
    {
      surveyId: {
        type: mongoose.Types.ObjectId,
        ref: "Survey",
      },
      score: {
        type: Number,
      },
    },
  ],
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

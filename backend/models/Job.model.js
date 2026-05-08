const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true },
    department:   { type: String, default: "General" },
    location:     { type: String, default: "Remote" },
    type:         { type: String, default: "Full Time" },  // No enum restriction
    experience:   { type: String, default: "Any" },
    description:  { type: String, default: "" },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    salary:       { type: String, default: "" },
    isActive:     { type: Boolean, default: true },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
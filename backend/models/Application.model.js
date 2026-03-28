const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job:       { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    jobTitle:  { type: String },                         // Stored for reference even if job deleted
    name:      { type: String, required: true },
    email:     { type: String, required: true, lowercase: true },
    phone:     { type: String, required: true },
    resume:    { type: String, required: true },         // File path
    coverLetter: { type: String, default: "" },
    linkedIn:  { type: String, default: "" },
    portfolio: { type: String, default: "" },
    status:    {
      type: String,
      enum: ["new", "reviewing", "shortlisted", "rejected", "hired"],
      default: "new",
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
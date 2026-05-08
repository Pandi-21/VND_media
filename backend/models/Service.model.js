const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    slug:        { type: String, unique: true },
    description: { type: String, required: true },
    shortDesc:   { type: String, default: "" },
    icon:        { type: String, default: "" },
    image:       { type: String, default: "" },
    features:    [{ type: String }],
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
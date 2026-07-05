const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    price:       { type: String, required: true },
    description: { type: String, required: true },
    features:    [{ type: String }],
    badge:       { type: String, default: "" },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);

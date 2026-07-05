const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    role:   { type: String, required: true, trim: true },
    text:   { type: String, required: true },
    stars:  { type: Number, default: 5 },
    avatar: { type: String, default: "" },
    order:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

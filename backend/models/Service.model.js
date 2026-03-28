const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    slug:        { type: String, unique: true },
    description: { type: String, required: true },
    shortDesc:   { type: String, default: "" },         // Card summary
    icon:        { type: String, default: "" },          // Icon name or URL
    image:       { type: String, default: "" },
    features:    [{ type: String }],                    // Feature bullet points
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },           // For sorting
  },
  { timestamps: true }
);

const slugify = require("slugify");

serviceSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Service", serviceSchema);
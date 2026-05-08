const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, unique: true },
    excerpt:     { type: String, required: true },
    content:     { type: String, required: true },
    coverImage:  { type: String, default: "" },
    author:      { type: String, default: "Admin" },
    category:    { type: String, default: "General" },
    tags:        [{ type: String }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    views:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
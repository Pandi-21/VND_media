const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, unique: true },
    excerpt:     { type: String, required: true },          // Short summary
    content:     { type: String, required: true },          // Full HTML/markdown content
    coverImage:  { type: String, default: "" },             // Image URL/path
    author:      { type: String, default: "Admin" },
    category:    { type: String, default: "General" },
    tags:        [{ type: String }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    views:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
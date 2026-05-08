const mongoose = require("mongoose");

// ── Team Member Sub-Schema  
const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Member name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    // Store the image as base64 string or a file path/URL (from multer/cloudinary)
    photoUrl: {
      type: String,
      required: [true, "Photo is required"],
    },
    photoPublicId: {
      // For Cloudinary cleanup (optional)
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ── Client Testimonial Sub-Schema ───────────────────────────────────────────
const clientTestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },
    // Video stored as URL (CDN / Cloudinary) or local path
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    videoPublicId: {
      // For Cloudinary cleanup (optional)
      type: String,
      default: null,
    },
    videoFilename: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ── Main About Schema 
// Using a single-document pattern — one "About" doc holds all team + testimonials
const aboutSchema = new mongoose.Schema(
  {
    // Singleton key so we always upsert the same document
    _singleton: {
      type: String,
      default: "about",
      unique: true,
    },
    teamMembers: [teamMemberSchema],
    testimonials: [clientTestimonialSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
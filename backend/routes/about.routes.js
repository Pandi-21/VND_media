const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/about.controller");
const { protect } = require("../middleware/auth.middleware");
const {
  uploadPhoto,
  uploadVideo,
  handleMulterError,
} = require("../middleware/upload.middleware");

// ════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ════════════════════════════════════════════════════════════════════════════

// GET /api/about  ──  Return all public about-page data
router.get("/", aboutController.getAboutData);

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — TEAM MEMBERS
// ════════════════════════════════════════════════════════════════════════════

// POST /api/about/admin/team  ── Add a team member (with photo upload)
router.post(
  "/admin/team",
  protect,
  uploadPhoto.single("photo"),
  handleMulterError,
  aboutController.addTeamMember
);

// PATCH /api/about/admin/team/:memberId  ── Update name/role/photo/order
router.patch(
  "/admin/team/:memberId",
  protect,
  uploadPhoto.single("photo"),
  handleMulterError,
  aboutController.updateTeamMember
);

// DELETE /api/about/admin/team/:memberId  ── Remove a team member
router.delete("/admin/team/:memberId", protect, aboutController.deleteTeamMember);

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — TESTIMONIALS (CLIENT VIDEOS)
// ════════════════════════════════════════════════════════════════════════════

// POST /api/about/admin/testimonials  ── Add a client testimonial (with video)
router.post(
  "/admin/testimonials",
  protect,
  uploadVideo.single("video"),
  handleMulterError,
  aboutController.addTestimonial
);

// PATCH /api/about/admin/testimonials/:testimonialId  ── Update testimonial
router.patch(
  "/admin/testimonials/:testimonialId",
  protect,
  uploadVideo.single("video"),
  handleMulterError,
  aboutController.updateTestimonial
);

// DELETE /api/about/admin/testimonials/:testimonialId
router.delete(
  "/admin/testimonials/:testimonialId",
  protect,
  aboutController.deleteTestimonial
);

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — REORDER (drag-and-drop support)
// ════════════════════════════════════════════════════════════════════════════

// PATCH /api/about/admin/reorder  ── Bulk update order fields
router.patch("/admin/reorder", protect, aboutController.reorder);

module.exports = router;
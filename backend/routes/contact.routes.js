const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
const { protect } = require("../middleware/auth.middleware");

// ─── PUBLIC: Submit Contact Form ──────────────────────────────────────────────

// POST /api/contact
router.post("/", contactController.submitContactForm);

// ─── ADMIN: View Contact Submissions ─────────────────────────────────────────

// GET /api/contact/admin/all
router.get("/admin/all", protect, contactController.getAllSubmissionsAdmin);

// GET /api/contact/admin/:id - Single submission
router.get("/admin/:id", protect, contactController.getSubmissionByIdAdmin);

// PATCH /api/contact/admin/:id - Update read/replied status + notes
router.patch("/admin/:id", protect, contactController.updateSubmissionAdmin);

// DELETE /api/contact/admin/:id
router.delete("/admin/:id", protect, contactController.deleteSubmissionAdmin);

module.exports = router;

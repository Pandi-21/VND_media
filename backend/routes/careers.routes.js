const express = require("express");
const router = express.Router();
const careersController = require("../controllers/careers.controller");
const { protect } = require("../middleware/auth.middleware");
const { uploadResume } = require("../middleware/upload.middleware");

// ─── PUBLIC: JOB LISTINGS ─────────────────────────────────────────────────────

// GET /api/careers/jobs - Active jobs
router.get("/jobs", careersController.getActiveJobs);

// GET /api/careers/jobs/:id - Single job detail
router.get("/jobs/:id", careersController.getJobById);

// ─── PUBLIC: JOB APPLICATION ──────────────────────────────────────────────────

// POST /api/careers/apply - Submit application
router.post("/apply", uploadResume.single("resume"), careersController.applyJob);

// ─── ADMIN: MANAGE JOBS ───────────────────────────────────────────────────────

// GET /api/careers/admin/jobs - All jobs
router.get("/admin/jobs", protect, careersController.getAllJobsAdmin);

// POST /api/careers/admin/jobs - Create job
router.post("/admin/jobs", protect, careersController.createJobAdmin);

// PUT /api/careers/admin/jobs/:id - Update job
router.put("/admin/jobs/:id", protect, careersController.updateJobAdmin);

// DELETE /api/careers/admin/jobs/:id
router.delete("/admin/jobs/:id", protect, careersController.deleteJobAdmin);

// PATCH /api/careers/admin/jobs/:id/toggle - Toggle active
router.patch("/admin/jobs/:id/toggle", protect, careersController.toggleJobAdmin);

// ─── ADMIN: MANAGE APPLICATIONS ───────────────────────────────────────────────

// GET /api/careers/admin/applications - All applications
router.get("/admin/applications", protect, careersController.getAllApplicationsAdmin);

// GET /api/careers/admin/applications/:id
router.get("/admin/applications/:id", protect, careersController.getApplicationByIdAdmin);

// PATCH /api/careers/admin/applications/:id/status - Update application status
router.patch("/admin/applications/:id/status", protect, careersController.updateApplicationStatusAdmin);

// DELETE /api/careers/admin/applications/:id
router.delete("/admin/applications/:id", protect, careersController.deleteApplicationAdmin);

module.exports = router;
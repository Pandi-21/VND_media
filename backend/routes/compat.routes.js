const express = require("express");
const router  = express.Router();
const compatController = require("../controllers/compat.controller");
const { protect } = require("../middleware/auth.middleware");
const { uploadResume } = require("../middleware/upload.middleware");

// ─── PUBLIC: GET /api/jobs/all ────────────────────────────────────────────────
router.get("/jobs/all", compatController.compatGetAllJobs);

// ─── ADMIN: POST /api/jobs/add ────────────────────────────────────────────────
router.post("/jobs/add", protect, compatController.compatAddJob);

// ─── ADMIN: PUT /api/jobs/update/:id ─────────────────────────────────────────
router.put("/jobs/update/:id", protect, compatController.compatUpdateJob);

// ─── ADMIN: DELETE /api/jobs/delete/:id ──────────────────────────────────────
router.delete("/jobs/delete/:id", protect, compatController.compatDeleteJob);

// ─── PUBLIC: POST /api/careers/apply ─────────────────────────────────────────
router.post("/careers/apply", uploadResume.single("resume"), compatController.compatApplyCareer);

// ─── ADMIN: GET /api/careers/all ─────────────────────────────────────────────
router.get("/careers/all", protect, compatController.compatGetAllCareers);

// ─── ADMIN: DELETE /api/careers/delete/:id ───────────────────────────────────
router.delete("/careers/delete/:id", protect, compatController.compatDeleteCareer);

// ─── PUBLIC: POST /api/send-email ────────────────────────────────────────────
router.post("/send-email", compatController.compatSendEmail);

module.exports = router;
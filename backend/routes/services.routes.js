const express = require("express");
const router = express.Router();
const servicesController = require("../controllers/services.controller");
const { protect } = require("../middleware/auth.middleware");
const { uploadImage } = require("../middleware/upload.middleware");

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

// GET /api/services - All active services
router.get("/", servicesController.getActiveServices);

// GET /api/services/:slug
router.get("/:slug", servicesController.getServiceBySlug);

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// GET /api/services/admin/all
router.get("/admin/all", protect, servicesController.getAllServicesAdmin);

// POST /api/services/admin
router.post("/admin", protect, uploadImage.single("image"), servicesController.createServiceAdmin);

// PUT /api/services/admin/:id
router.put("/admin/:id", protect, uploadImage.single("image"), servicesController.updateServiceAdmin);

// DELETE /api/services/admin/:id
router.delete("/admin/:id", protect, servicesController.deleteServiceAdmin);

// PATCH /api/services/admin/:id/toggle
router.patch("/admin/:id/toggle", protect, servicesController.toggleServiceAdmin);

// PATCH /api/services/admin/reorder - Update display order
router.patch("/admin/reorder", protect, servicesController.reorderServicesAdmin);

module.exports = router;
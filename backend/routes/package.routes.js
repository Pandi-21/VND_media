const express = require("express");
const router = express.Router();
const packageController = require("../controllers/package.controller");
const { protect } = require("../middleware/auth.middleware");

// PUBLIC
router.get("/", packageController.getPackages);

// ADMIN (Protected)
router.get("/admin/all", protect, packageController.adminGetPackages);
router.post("/admin", protect, packageController.createPackage);
router.put("/admin/:id", protect, packageController.updatePackage);
router.delete("/admin/:id", protect, packageController.deletePackage);

module.exports = router;

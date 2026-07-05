const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/me
router.get("/me", protect, authController.me);

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/change-password
router.post("/change-password", protect, authController.changePassword);

module.exports = router;
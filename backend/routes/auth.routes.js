// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin.model");
// const { protect } = require("../middleware/auth.middleware");

// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// // ─── POST /api/auth/login ─────────────────────────────────────────────────────
// router.post("/login", async (req, res) => {
//   try {
//     const { email, username, password } = req.body;
//     const loginEmail = email || username;

//     if (!loginEmail || !password) {
//       return res.status(400).json({ success: false, message: "Email and password are required." });
//     }

//     const admin = await Admin.findOne({ email: loginEmail });
//     if (!admin || !(await admin.comparePassword(password))) {
//       return res.status(401).json({ success: false, message: "Invalid email or password." });
//     }

//     res.json({
//       success: true,
//       token: generateToken(admin._id),
//       admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // ─── GET /api/auth/me ─────────────────────────────────────────────────────────
// router.get("/me", protect, (req, res) => {
//   res.json({ success: true, admin: req.admin });
// });

// // ─── POST /api/auth/register (run once to create first admin, then disable) ──
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const exists = await Admin.findOne({ email });
//     if (exists) return res.status(400).json({ success: false, message: "Admin already exists." });

//     const admin = await Admin.create({ name, email, password, role });
//     res.status(201).json({
//       success: true,
//       token: generateToken(admin._id),
//       admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // ─── POST /api/auth/change-password ──────────────────────────────────────────
// router.post("/change-password", protect, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const admin = await Admin.findById(req.admin._id);

//     if (!(await admin.comparePassword(currentPassword))) {
//       return res.status(400).json({ success: false, message: "Current password is wrong." });
//     }

//     admin.password = newPassword;
//     await admin.save();
//     res.json({ success: true, message: "Password changed successfully." });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin.model");
const { protect } = require("../middleware/auth.middleware");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginEmail = email || username;

    if (!loginEmail || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: loginEmail });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Admin already exists." });

    const hashed = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ name, email, password: hashed, role });

    res.status(201).json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/change-password
router.post("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!(await admin.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: "Current password is wrong." });
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();
    res.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
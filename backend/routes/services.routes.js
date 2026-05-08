// const express = require("express");
// const router = express.Router();
// const Service = require("../models/Service.model");
// const { protect } = require("../middleware/auth.middleware");
// const { uploadImage } = require("../middleware/upload.middleware");

// // ─── PUBLIC ───────────────────────────────────────────────────────────────────

// // GET /api/services - All active services
// router.get("/", async (req, res) => {
//   try {
//     const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
//     res.json({ success: true, services });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // GET /api/services/:slug
// router.get("/:slug", async (req, res) => {
//   try {
//     const service = await Service.findOne({ slug: req.params.slug, isActive: true });
//     if (!service) return res.status(404).json({ success: false, message: "Service not found." });
//     res.json({ success: true, service });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // ─── ADMIN (Protected) ────────────────────────────────────────────────────────

// // GET /api/services/admin/all
// router.get("/admin/all", protect, async (req, res) => {
//   try {
//     const services = await Service.find().sort({ order: 1, createdAt: -1 });
//     res.json({ success: true, services });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // POST /api/services/admin
// router.post("/admin", protect, uploadImage.single("image"), async (req, res) => {
//   try {
//     const { title, description, shortDesc, icon, features, isActive, order } = req.body;

//     const service = await Service.create({
//       title, description, shortDesc, icon,
//       features: features ? JSON.parse(features) : [],
//       isActive: isActive !== "false",
//       order: order || 0,
//       image: req.file ? `/uploads/images/${req.file.filename}` : "",
//     });

//     res.status(201).json({ success: true, service });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // PUT /api/services/admin/:id
// router.put("/admin/:id", protect, uploadImage.single("image"), async (req, res) => {
//   try {
//     const { title, description, shortDesc, icon, features, isActive, order } = req.body;

//     const update = {
//       title, description, shortDesc, icon,
//       features: features ? JSON.parse(features) : [],
//       isActive: isActive !== "false",
//       order: order || 0,
//     };
//     if (req.file) update.image = `/uploads/images/${req.file.filename}`;

//     const service = await Service.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
//     if (!service) return res.status(404).json({ success: false, message: "Service not found." });

//     res.json({ success: true, service });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // DELETE /api/services/admin/:id
// router.delete("/admin/:id", protect, async (req, res) => {
//   try {
//     await Service.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Service deleted." });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // PATCH /api/services/admin/:id/toggle
// router.patch("/admin/:id/toggle", protect, async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) return res.status(404).json({ success: false, message: "Service not found." });
//     service.isActive = !service.isActive;
//     await service.save();
//     res.json({ success: true, isActive: service.isActive });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // PATCH /api/services/admin/reorder - Update display order
// router.patch("/admin/reorder", protect, async (req, res) => {
//   try {
//     // req.body.order = [{ id: "...", order: 0 }, ...]
//     const updates = req.body.order.map(({ id, order }) =>
//       Service.findByIdAndUpdate(id, { order })
//     );
//     await Promise.all(updates);
//     res.json({ success: true, message: "Order updated." });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Service = require("../models/Service.model");
const { protect } = require("../middleware/auth.middleware");
const { uploadImage } = require("../middleware/upload.middleware");

const makeSlug = (title) =>
  title.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") + "-" + Date.now();

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

router.get("/admin/all", protect, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin", protect, uploadImage.single("image"), async (req, res) => {
  try {
    const { title, description, shortDesc, icon, features, isActive, order } = req.body;
    const service = await Service.create({
      title,
      slug:      makeSlug(title),
      description,
      shortDesc: shortDesc || "",
      icon:      icon      || "",
      features:  features  ? JSON.parse(features) : [],
      isActive:  isActive !== "false",
      order:     order     || 0,
      image:     req.file  ? `/uploads/images/${req.file.filename}` : "",
    });
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admin/:id", protect, uploadImage.single("image"), async (req, res) => {
  try {
    const { title, description, shortDesc, icon, features, isActive, order } = req.body;
    const update = {
      title, description,
      shortDesc: shortDesc || "",
      icon:      icon      || "",
      features:  features  ? JSON.parse(features) : [],
      isActive:  isActive !== "false",
      order:     order     || 0,
    };
    if (req.file) update.image = `/uploads/images/${req.file.filename}`;
    const service = await Service.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admin/:id", protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Service deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch("/admin/:id/toggle", protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });
    service.isActive = !service.isActive;
    await service.save();
    res.json({ success: true, isActive: service.isActive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch("/admin/reorder", protect, async (req, res) => {
  try {
    const updates = req.body.order.map(({ id, order }) => Service.findByIdAndUpdate(id, { order }));
    await Promise.all(updates);
    res.json({ success: true, message: "Order updated." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
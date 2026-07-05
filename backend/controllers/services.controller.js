const Service = require("../models/Service.model");

const makeSlug = (title) =>
  title.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") + "-" + Date.now();

// GET /api/services
exports.getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/services/:slug
exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/services/admin/all
exports.getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/services/admin
exports.createServiceAdmin = async (req, res) => {
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
};

// PUT /api/services/admin/:id
exports.updateServiceAdmin = async (req, res) => {
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
};

// DELETE /api/services/admin/:id
exports.deleteServiceAdmin = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Service deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/services/admin/:id/toggle
exports.toggleServiceAdmin = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });
    service.isActive = !service.isActive;
    await service.save();
    res.json({ success: true, isActive: service.isActive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/services/admin/reorder
exports.reorderServicesAdmin = async (req, res) => {
  try {
    const updates = req.body.order.map(({ id, order }) => Service.findByIdAndUpdate(id, { order }));
    await Promise.all(updates);
    res.json({ success: true, message: "Order updated." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

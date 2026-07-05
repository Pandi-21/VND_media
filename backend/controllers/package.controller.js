const Package = require("../models/Package.model");

// GET /api/packages - Public active packages
exports.getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

// GET /api/packages/admin/all - Admin dashboard packages view
exports.adminGetPackages = async (req, res, next) => {
  try {
    const packages = await Package.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

// POST /api/packages/admin - Create new package
exports.createPackage = async (req, res, next) => {
  try {
    const { name, price, description, features, badge, isActive, order } = req.body;
    
    // Parse features if sent as JSON string or handle as array
    let parsedFeatures = features;
    if (typeof features === "string") {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = features.split(",").map(f => f.trim()).filter(Boolean);
      }
    }

    const packageDoc = new Package({
      name,
      price,
      description,
      features: parsedFeatures || [],
      badge: badge || "",
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? Number(order) : 0,
    });

    await packageDoc.save();
    res.status(201).json({ success: true, package: packageDoc });
  } catch (error) {
    next(error);
  }
};

// PUT /api/packages/admin/:id - Update existing package
exports.updatePackage = async (req, res, next) => {
  try {
    const { name, price, description, features, badge, isActive, order } = req.body;
    const { id } = req.params;

    let parsedFeatures = features;
    if (typeof features === "string") {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = features.split(",").map(f => f.trim()).filter(Boolean);
      }
    }

    const packageDoc = await Package.findById(id);
    if (!packageDoc) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    if (name !== undefined) packageDoc.name = name;
    if (price !== undefined) packageDoc.price = price;
    if (description !== undefined) packageDoc.description = description;
    if (parsedFeatures !== undefined) packageDoc.features = parsedFeatures;
    if (badge !== undefined) packageDoc.badge = badge;
    if (isActive !== undefined) packageDoc.isActive = isActive;
    if (order !== undefined) packageDoc.order = Number(order);

    await packageDoc.save();
    res.json({ success: true, package: packageDoc });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/packages/admin/:id - Delete existing package
exports.deletePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const packageDoc = await Package.findByIdAndDelete(id);
    if (!packageDoc) {
      return res.status(444).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    next(error);
  }
};

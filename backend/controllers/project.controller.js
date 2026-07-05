const Project = require("../models/Project.model");

// GET /api/projects - Public: all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/admin/all - Admin: all projects
exports.getProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/projects - Admin: create project
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, link, order } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: "Title, description and category are required." });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Project cover image is required." });
    }

    const project = await Project.create({
      title,
      description,
      category,
      link: link || "",
      order: order ? parseInt(order) : 0,
      image: `/uploads/images/${req.file.filename}`,
    });

    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/projects/:id - Admin: update project
exports.updateProject = async (req, res) => {
  try {
    const { title, description, category, link, order } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (link !== undefined) project.link = link;
    if (order !== undefined) project.order = parseInt(order);
    if (req.file) {
      project.image = `/uploads/images/${req.file.filename}`;
    }

    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/projects/:id - Admin: delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    res.json({ success: true, message: "Project deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

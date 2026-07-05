const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const { protect } = require("../middleware/auth.middleware");
const { uploadImage } = require("../middleware/upload.middleware");

// PUBLIC
router.get("/", projectController.getProjects);

// ADMIN
router.get("/admin/all", protect, projectController.getProjectsAdmin);
router.post("/", protect, uploadImage.single("image"), projectController.createProject);
router.put("/:id", protect, uploadImage.single("image"), projectController.updateProject);
router.delete("/:id", protect, projectController.deleteProject);

module.exports = router;

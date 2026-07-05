const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const { protect } = require("../middleware/auth.middleware");
const { uploadImage } = require("../middleware/upload.middleware");

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

// GET /api/blog - All published posts
router.get("/", blogController.getPublishedBlogs);

// GET /api/blog/admin/all - Admin: all posts including drafts
router.get("/admin/all", protect, blogController.getAllBlogsAdmin);

// GET /api/blog/:slug - Single post by slug (Must be after other paths to avoid matching 'admin')
router.get("/:slug", blogController.getBlogBySlug);

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// POST /api/blog - Create post
router.post("/", protect, uploadImage.single("coverImage"), blogController.createBlog);

// PUT /api/blog/:id - Update post
router.put("/:id", protect, uploadImage.single("coverImage"), blogController.updateBlog);

// DELETE /api/blog/:id
router.delete("/:id", protect, blogController.deleteBlog);

// PATCH /api/blog/:id/toggle - Toggle publish
router.patch("/:id/toggle", protect, blogController.togglePublish);

module.exports = router;
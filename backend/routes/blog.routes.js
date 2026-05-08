// const express = require("express");
// const router = express.Router();
// const Blog = require("../models/Blog.model");
// const { protect } = require("../middleware/auth.middleware");
// const { uploadImage } = require("../middleware/upload.middleware");

// // ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// // GET /api/blog - All published posts (with pagination)
// router.get("/", async (req, res) => {
//   try {
//     const page  = parseInt(req.query.page)  || 1;
//     const limit = parseInt(req.query.limit) || 9;
//     const skip  = (page - 1) * limit;
//     const category = req.query.category;
//     const search   = req.query.search;

//     const query = { isPublished: true };
//     if (category) query.category = category;
//     if (search)   query.$or = [
//       { title: { $regex: search, $options: "i" } },
//       { excerpt: { $regex: search, $options: "i" } },
//     ];

//     const [posts, total] = await Promise.all([
//       Blog.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit),
//       Blog.countDocuments(query),
//     ]);

//     res.json({ success: true, posts, total, page, pages: Math.ceil(total / limit) });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // ─── ADMIN ROUTES (Protected) ─────────────────────────────────────────────────
// // ✅ இவை எல்லாம் /:slug க்கு முன்னாடி வரணும் — otherwise Express slug-ஆ match பண்ணும்

// // GET /api/blog/admin/all - All posts including drafts
// router.get("/admin/all", protect, async (req, res) => {
//   try {
//     const posts = await Blog.find().sort({ createdAt: -1 });
//     res.json({ success: true, posts });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // POST /api/blog - Create post
// router.post("/", protect, uploadImage.single("coverImage"), async (req, res) => {
//   try {
//     const { title, excerpt, content, category, tags, isPublished, author } = req.body;

//     const post = await Blog.create({
//       title, excerpt, content, category, author,
//       tags: tags ? JSON.parse(tags) : [],
//       isPublished: isPublished === "true",
//       coverImage: req.file ? `/uploads/images/${req.file.filename}` : "",
//     });

//     res.status(201).json({ success: true, post });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // PUT /api/blog/:id - Update post
// router.put("/:id", protect, uploadImage.single("coverImage"), async (req, res) => {
//   try {
//     const { title, excerpt, content, category, tags, isPublished, author } = req.body;

//     const update = {
//       title, excerpt, content, category, author,
//       tags: tags ? JSON.parse(tags) : [],
//       isPublished: isPublished === "true",
//     };

//     if (req.file) update.coverImage = `/uploads/images/${req.file.filename}`;

//     const post = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
//     if (!post) return res.status(404).json({ success: false, message: "Post not found." });

//     res.json({ success: true, post });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // DELETE /api/blog/:id
// router.delete("/:id", protect, async (req, res) => {
//   try {
//     const post = await Blog.findByIdAndDelete(req.params.id);
//     if (!post) return res.status(404).json({ success: false, message: "Post not found." });
//     res.json({ success: true, message: "Post deleted." });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // PATCH /api/blog/:id/toggle - Toggle publish
// router.patch("/:id/toggle", protect, async (req, res) => {
//   try {
//     const post = await Blog.findById(req.params.id);
//     if (!post) return res.status(404).json({ success: false, message: "Post not found." });

//     post.isPublished = !post.isPublished;
//     if (post.isPublished && !post.publishedAt) post.publishedAt = new Date();
//     await post.save();

//     res.json({ success: true, isPublished: post.isPublished });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // ✅ இது கடைசியா வரணும் — dynamic :slug எல்லாத்தையும் match பண்ணும்
// // GET /api/blog/:slug - Single post by slug
// router.get("/:slug", async (req, res) => {
//   try {
//     const post = await Blog.findOne({ slug: req.params.slug, isPublished: true });
//     if (!post) return res.status(404).json({ success: false, message: "Post not found." });

//     post.views += 1;
//     await post.save();

//     res.json({ success: true, post });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog.model");
const { protect } = require("../middleware/auth.middleware");
const { uploadImage } = require("../middleware/upload.middleware");

// Simple slug generator
const makeSlug = (title) =>
  title.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") + "-" + Date.now();

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

// GET /api/blog - All published posts
router.get("/", async (req, res) => {
  try {
    const page     = parseInt(req.query.page)  || 1;
    const limit    = parseInt(req.query.limit) || 9;
    const skip     = (page - 1) * limit;
    const category = req.query.category;
    const search   = req.query.search;

    const query = { isPublished: true };
    if (category) query.category = category;
    if (search)   query.$or = [
      { title:   { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
    ];

    const [posts, total] = await Promise.all([
      Blog.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(query),
    ]);

    res.json({ success: true, posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/admin/all - Admin: all posts including drafts
router.get("/admin/all", protect, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip  = (page - 1) * limit;
    const search   = req.query.search;
    const category = req.query.category;

    const query = {};
    if (category && category !== "All") query.category = category;
    if (search) query.$or = [
      { title:   { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
    ];

    const [posts, total] = await Promise.all([
      Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(query),
    ]);

    res.json({ success: true, posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/:slug - Single post
router.get("/:slug", async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ success: false, message: "Post not found." });
    post.views += 1;
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// POST /api/blog - Create post
router.post("/", protect, uploadImage.single("coverImage"), async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, isPublished, author } = req.body;

    const post = await Blog.create({
      title,
      slug:        makeSlug(title),
      excerpt,
      content,
      category:    category    || "General",
      author:      author      || "Admin",
      tags:        tags        ? JSON.parse(tags) : [],
      isPublished: isPublished === "true",
      publishedAt: isPublished === "true" ? new Date() : null,
      coverImage:  req.file    ? `/uploads/images/${req.file.filename}` : "",
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/blog/:id - Update post
router.put("/:id", protect, uploadImage.single("coverImage"), async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, isPublished, author } = req.body;

    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Post not found." });

    const wasPublished = existing.isPublished;
    const nowPublished = isPublished === "true";

    existing.title       = title       || existing.title;
    existing.excerpt     = excerpt     || existing.excerpt;
    existing.content     = content     || existing.content;
    existing.category    = category    || existing.category;
    existing.author      = author      || existing.author;
    existing.tags        = tags        ? JSON.parse(tags) : existing.tags;
    existing.isPublished = nowPublished;
    if (!wasPublished && nowPublished) existing.publishedAt = new Date();
    if (req.file) existing.coverImage = `/uploads/images/${req.file.filename}`;

    await existing.save();
    res.json({ success: true, post: existing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/blog/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/blog/:id/toggle - Toggle publish
router.patch("/:id/toggle", protect, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found." });
    post.isPublished = !post.isPublished;
    if (post.isPublished && !post.publishedAt) post.publishedAt = new Date();
    await post.save();
    res.json({ success: true, isPublished: post.isPublished });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
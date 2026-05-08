const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const About = require("../models/About.model");
const { protect } = require("../middleware/auth.middleware");
const {
  uploadPhoto,
  uploadVideo,
  handleMulterError,
} = require("../middleware/upload.middleware");

// ── Helper: get or create singleton About doc ────────────────────────────────
const getAbout = async () => {
  let doc = await About.findOne({ _singleton: "about" });
  if (!doc) doc = await About.create({ _singleton: "about" });
  return doc;
};

// ── Helper: delete file from disk ────────────────────────────────────────────
const deleteFile = (filePath) => {
  if (!filePath) return;
  // Only delete local files (not CDN URLs)
  if (filePath.startsWith("http")) return;
  const abs = path.resolve(filePath.replace(/^\//, ""));
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
};

// ════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ════════════════════════════════════════════════════════════════════════════

// GET /api/about  ──  Return all public about-page data
router.get("/", async (_req, res) => {
  try {
    const doc = await getAbout();

    // Build public-safe response (sorted by order field)
    const teamMembers = [...doc.teamMembers].sort((a, b) => a.order - b.order);
    const testimonials = [...doc.testimonials].sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: { teamMembers, testimonials },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — TEAM MEMBERS
// ════════════════════════════════════════════════════════════════════════════

// POST /api/about/admin/team  ── Add a team member (with photo upload)
router.post(
  "/admin/team",
  protect,
  uploadPhoto.single("photo"),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Photo file is required." });
      }

      const { name, role, order } = req.body;

      if (!name?.trim() || !role?.trim()) {
        // Clean up uploaded file on validation fail
        deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Name and role are required.",
        });
      }

      const doc = await getAbout();

      const newMember = {
        name: name.trim(),
        role: role.trim(),
        photoUrl: `/${req.file.path.replace(/\\/g, "/")}`,
        order: order ? parseInt(order, 10) : doc.teamMembers.length,
      };

      doc.teamMembers.push(newMember);
      await doc.save();

      const added = doc.teamMembers[doc.teamMembers.length - 1];

      res.status(201).json({
        success: true,
        message: "Team member added successfully.",
        member: added,
      });
    } catch (error) {
      if (req.file) deleteFile(req.file.path);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// PATCH /api/about/admin/team/:memberId  ── Update name/role/photo/order
router.patch(
  "/admin/team/:memberId",
  protect,
  uploadPhoto.single("photo"),
  handleMulterError,
  async (req, res) => {
    try {
      const doc = await getAbout();
      const member = doc.teamMembers.id(req.params.memberId);

      if (!member) {
        if (req.file) deleteFile(req.file.path);
        return res
          .status(404)
          .json({ success: false, message: "Team member not found." });
      }

      const { name, role, order } = req.body;

      if (name?.trim()) member.name = name.trim();
      if (role?.trim()) member.role = role.trim();
      if (order !== undefined) member.order = parseInt(order, 10);

      if (req.file) {
        // Delete old photo from disk
        deleteFile(member.photoUrl);
        member.photoUrl = `/${req.file.path.replace(/\\/g, "/")}`;
      }

      await doc.save();

      res.json({
        success: true,
        message: "Team member updated.",
        member,
      });
    } catch (error) {
      if (req.file) deleteFile(req.file.path);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// DELETE /api/about/admin/team/:memberId  ── Remove a team member
router.delete("/admin/team/:memberId", protect, async (req, res) => {
  try {
    const doc = await getAbout();
    const member = doc.teamMembers.id(req.params.memberId);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Team member not found." });
    }

    deleteFile(member.photoUrl);
    member.deleteOne();
    await doc.save();

    res.json({ success: true, message: "Team member removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — TESTIMONIALS (CLIENT VIDEOS)
// ════════════════════════════════════════════════════════════════════════════

// POST /api/about/admin/testimonials  ── Add a client testimonial (with video)
router.post(
  "/admin/testimonials",
  protect,
  uploadVideo.single("video"),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Video file is required." });
      }

      const { name, company, order } = req.body;

      if (!name?.trim() || !company?.trim()) {
        deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Client name and company are required.",
        });
      }

      const doc = await getAbout();

      const newTestimonial = {
        name: name.trim(),
        company: company.trim(),
        videoUrl: `/${req.file.path.replace(/\\/g, "/")}`,
        videoFilename: req.file.originalname,
        order: order ? parseInt(order, 10) : doc.testimonials.length,
      };

      doc.testimonials.push(newTestimonial);
      await doc.save();

      const added = doc.testimonials[doc.testimonials.length - 1];

      res.status(201).json({
        success: true,
        message: "Testimonial added successfully.",
        testimonial: added,
      });
    } catch (error) {
      if (req.file) deleteFile(req.file.path);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// PATCH /api/about/admin/testimonials/:testimonialId  ── Update testimonial
router.patch(
  "/admin/testimonials/:testimonialId",
  protect,
  uploadVideo.single("video"),
  handleMulterError,
  async (req, res) => {
    try {
      const doc = await getAbout();
      const testimonial = doc.testimonials.id(req.params.testimonialId);

      if (!testimonial) {
        if (req.file) deleteFile(req.file.path);
        return res
          .status(404)
          .json({ success: false, message: "Testimonial not found." });
      }

      const { name, company, order } = req.body;

      if (name?.trim()) testimonial.name = name.trim();
      if (company?.trim()) testimonial.company = company.trim();
      if (order !== undefined) testimonial.order = parseInt(order, 10);

      if (req.file) {
        deleteFile(testimonial.videoUrl);
        testimonial.videoUrl = `/${req.file.path.replace(/\\/g, "/")}`;
        testimonial.videoFilename = req.file.originalname;
      }

      await doc.save();

      res.json({
        success: true,
        message: "Testimonial updated.",
        testimonial,
      });
    } catch (error) {
      if (req.file) deleteFile(req.file.path);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// DELETE /api/about/admin/testimonials/:testimonialId
router.delete(
  "/admin/testimonials/:testimonialId",
  protect,
  async (req, res) => {
    try {
      const doc = await getAbout();
      const testimonial = doc.testimonials.id(req.params.testimonialId);

      if (!testimonial) {
        return res
          .status(404)
          .json({ success: false, message: "Testimonial not found." });
      }

      deleteFile(testimonial.videoUrl);
      testimonial.deleteOne();
      await doc.save();

      res.json({ success: true, message: "Testimonial removed." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — REORDER (drag-and-drop support)
// ════════════════════════════════════════════════════════════════════════════

// PATCH /api/about/admin/reorder  ── Bulk update order fields
// Body: { type: "team" | "testimonials", orderedIds: ["id1","id2",...] }
router.patch("/admin/reorder", protect, async (req, res) => {
  try {
    const { type, orderedIds } = req.body;

    if (!["team", "testimonials"].includes(type) || !Array.isArray(orderedIds)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reorder payload." });
    }

    const doc = await getAbout();
    const arr = type === "team" ? doc.teamMembers : doc.testimonials;

    orderedIds.forEach((id, idx) => {
      const item = arr.id(id);
      if (item) item.order = idx;
    });

    await doc.save();

    res.json({ success: true, message: "Order updated." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
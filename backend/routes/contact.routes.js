const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact.model");
const { protect } = require("../middleware/auth.middleware");
const {
  sendContactConfirmationToUser,
  sendContactNotificationToAdmin,
} = require("../utils/email.utils");

// ─── PUBLIC: Submit Contact Form ──────────────────────────────────────────────

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    const submission = await Contact.create({ name, email, phone, subject, message });

    // Send emails (non-blocking — won't fail the response if email fails)
    Promise.allSettled([
      sendContactConfirmationToUser({ name, email, subject }),
      sendContactNotificationToAdmin({ name, email, phone, subject, message }),
    ]);

    res.status(201).json({
      success: true,
      message: "Message sent! We'll get back to you soon.",
      submission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── ADMIN: View Contact Submissions ─────────────────────────────────────────

// GET /api/contact/admin/all
router.get("/admin/all", protect, async (req, res) => {
  try {
    const { isRead, isReplied } = req.query;
    const query = {};
    if (isRead !== undefined)    query.isRead    = isRead === "true";
    if (isReplied !== undefined) query.isReplied = isReplied === "true";

    const submissions = await Contact.find(query).sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments({ isRead: false });

    res.json({ success: true, submissions, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/contact/admin/:id - Single submission
router.get("/admin/:id", protect, async (req, res) => {
  try {
    const submission = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found." });
    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/contact/admin/:id - Update read/replied status + notes
router.patch("/admin/:id", protect, async (req, res) => {
  try {
    const { isRead, isReplied, adminNotes } = req.body;
    const submission = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead, isReplied, adminNotes },
      { new: true }
    );
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found." });
    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/contact/admin/:id
router.delete("/admin/:id", protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Submission deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
const Review = require("../models/Review.model");

// GET /api/reviews - Public: get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/reviews/admin/all - Admin: get all reviews
exports.getReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reviews - Admin: create review
exports.createReview = async (req, res) => {
  try {
    const { name, role, text, stars, order } = req.body;
    if (!name || !role || !text) {
      return res.status(400).json({ success: false, message: "Name, role/designation, and review text are required." });
    }

    const review = await Review.create({
      name,
      role,
      text,
      stars: stars ? parseInt(stars) : 5,
      order: order ? parseInt(order) : 0,
      avatar: req.file ? `/uploads/images/${req.file.filename}` : "",
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/reviews/:id - Admin: update review
exports.updateReview = async (req, res) => {
  try {
    const { name, role, text, stars, order } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    if (name) review.name = name;
    if (role) review.role = role;
    if (text) review.text = text;
    if (stars !== undefined) review.stars = parseInt(stars);
    if (order !== undefined) review.order = parseInt(order);
    if (req.file) {
      review.avatar = `/uploads/images/${req.file.filename}`;
    }

    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/reviews/:id - Admin: delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    res.json({ success: true, message: "Review deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

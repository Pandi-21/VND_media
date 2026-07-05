const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { protect } = require("../middleware/auth.middleware");
const { uploadImage } = require("../middleware/upload.middleware");

// PUBLIC
router.get("/", reviewController.getReviews);

// ADMIN
router.get("/admin/all", protect, reviewController.getReviewsAdmin);
router.post("/", protect, uploadImage.single("avatar"), reviewController.createReview);
router.put("/:id", protect, uploadImage.single("avatar"), reviewController.updateReview);
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;

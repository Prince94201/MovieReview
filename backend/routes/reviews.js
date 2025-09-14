const express = require('express');
const {
  getMovieReviews,
  createOrUpdateReview,
  deleteReview,
  getUserReviews,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const {
  validateReview,
  validateId,
  validateMovieId,
  validateUserId,
  validatePagination,
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/movies/:movieId/reviews', validateMovieId, validatePagination, getMovieReviews);
router.get('/users/:userId/reviews', validateUserId, validatePagination, getUserReviews);

// Protected routes
router.get('/my-reviews', protect, validatePagination, getMyReviews);
router.post('/movies/:movieId', protect, validateMovieId, validateReview, createOrUpdateReview);
router.delete('/:id', protect, validateId, deleteReview);

module.exports = router;
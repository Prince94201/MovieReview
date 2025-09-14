const express = require('express');
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus,
  getWatchlistStats,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');
const {
  validateId,
  validateMovieId,
  validatePagination,
} = require('../middleware/validation');

const router = express.Router();

// All routes are protected (user must be logged in)
router.get('/', protect, validatePagination, getWatchlist);
router.get('/stats', protect, getWatchlistStats);
router.get('/check/:movieId', protect, validateMovieId, checkWatchlistStatus);
router.post('/:movieId', protect, validateMovieId, addToWatchlist);
router.delete('/:movieId', protect, validateMovieId, removeFromWatchlist);

module.exports = router;
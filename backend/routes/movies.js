const express = require('express');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getTopRatedMovies,
  getTrendingMovies,
  getMoviesByCategory,
  getMoviesByGenre,
} = require('../controllers/movieController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateMovie, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes - order matters! More specific routes should come first
router.get('/top-rated', getTopRatedMovies);
router.get('/trending', getTrendingMovies);
router.get('/category/:category', getMoviesByCategory);
router.get('/genre/:genre', validatePagination, getMoviesByGenre);
router.get('/', validatePagination, getMovies);
router.get('/:id', validateId, getMovie);

// Protected routes (Admin only)
router.post('/', protect, adminOnly, validateMovie, createMovie);
router.put('/:id', protect, adminOnly, validateId, validateMovie, updateMovie);
router.delete('/:id', protect, adminOnly, validateId, deleteMovie);

module.exports = router;
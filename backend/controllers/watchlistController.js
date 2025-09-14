const { Watchlist, Movie, User } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Debug logging
  console.log('getWatchlist - User ID:', req.user.id, 'Username:', req.user.username);

  const { count, rows } = await Watchlist.findAndCountAll({
    where: { userId: req.user.id },
    include: [{
      model: Movie,
      as: 'movie',
      attributes: ['id', 'title', 'genre', 'releaseYear', 'director', 'posterUrl', 'avgRating'],
    }],
    limit,
    offset,
    order: [['addedAt', 'DESC']],
  });

  console.log('getWatchlist - Found watchlist items:', rows.length, 'for user:', req.user.id);

  // Transform the data to return movies directly (as expected by frontend)
  const watchlistMovies = rows.map(item => ({
    ...item.movie.dataValues,
    addedAt: item.addedAt, // Keep the watchlist timestamp
  }));

  res.json({
    success: true,
    data: {
      watchlist: watchlistMovies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    },
  });
});

// @desc    Add movie to watchlist
// @route   POST /api/watchlist/:movieId
// @access  Private
const addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  // Check if movie exists
  const movie = await Movie.findByPk(movieId);
  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found',
    });
  }

  // Check if movie is already in watchlist
  const existingWatchlistItem = await Watchlist.findOne({
    where: { userId, movieId },
  });

  if (existingWatchlistItem) {
    return res.status(400).json({
      success: false,
      message: 'Movie already in watchlist',
    });
  }

  // Add to watchlist
  const watchlistItem = await Watchlist.create({
    userId,
    movieId,
  });

  // Reload with movie data
  await watchlistItem.reload({
    include: [{
      model: Movie,
      as: 'movie',
      attributes: ['id', 'title', 'genre', 'releaseYear', 'director', 'posterUrl', 'avgRating'],
    }],
  });

  res.status(201).json({
    success: true,
    message: 'Movie added to watchlist',
    data: watchlistItem,
  });
});

// @desc    Remove movie from watchlist
// @route   DELETE /api/watchlist/:movieId
// @access  Private
const removeFromWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  const watchlistItem = await Watchlist.findOne({
    where: { userId, movieId },
  });

  if (!watchlistItem) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found in watchlist',
    });
  }

  await watchlistItem.destroy();

  res.json({
    success: true,
    message: 'Movie removed from watchlist',
  });
});

// @desc    Check if movie is in user's watchlist
// @route   GET /api/watchlist/check/:movieId
// @access  Private
const checkWatchlistStatus = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  const watchlistItem = await Watchlist.findOne({
    where: { userId, movieId },
  });

  res.json({
    success: true,
    data: {
      inWatchlist: !!watchlistItem,
    },
  });
});

// @desc    Get watchlist stats for user
// @route   GET /api/watchlist/stats
// @access  Private
const getWatchlistStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get total count
  const totalMovies = await Watchlist.count({
    where: { userId },
  });

  // Get genre breakdown
  const genreStats = await Watchlist.findAll({
    where: { userId },
    include: [{
      model: Movie,
      as: 'movie',
      attributes: ['genre'],
    }],
    attributes: [],
  });

  const genres = {};
  genreStats.forEach(item => {
    const genre = item.movie.genre;
    genres[genre] = (genres[genre] || 0) + 1;
  });

  // Get recent additions
  const recentAdditions = await Watchlist.findAll({
    where: { userId },
    include: [{
      model: Movie,
      as: 'movie',
      attributes: ['id', 'title', 'posterUrl'],
    }],
    limit: 5,
    order: [['addedAt', 'DESC']],
  });

  res.json({
    success: true,
    data: {
      totalMovies,
      genres, // Changed from genreBreakdown to genres
      recentAdditions,
    },
  });
});

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus,
  getWatchlistStats,
};
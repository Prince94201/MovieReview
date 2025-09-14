const { Movie, Review, User, sequelize } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

// @desc    Get all movies with pagination and search
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const genre = req.query.genre || '';
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder || 'DESC';

  const offset = (page - 1) * limit;

  // Build where clause
  const whereClause = {};
  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { director: { [Op.like]: `%${search}%` } },
      { cast: { [Op.like]: `%${search}%` } },
    ];
  }
  if (genre) {
    whereClause.genre = { [Op.like]: `%${genre}%` };
  }

  const { count, rows } = await Movie.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [[sortBy, sortOrder]],
    include: [{
      model: Review,
      as: 'reviews',
      attributes: ['rating'],
    }],
  });

  // Calculate average ratings
  const moviesWithRatings = rows.map(movie => {
    const movieData = movie.toJSON();
    if (movieData.reviews && movieData.reviews.length > 0) {
      const avgRating = movieData.reviews.reduce((sum, review) => sum + review.rating, 0) / movieData.reviews.length;
      movieData.avgRating = Math.round(avgRating * 100) / 100;
    } else {
      movieData.avgRating = 0;
    }
    delete movieData.reviews; // Remove reviews from response
    return movieData;
  });

  res.json({
    success: true,
    data: {
      movies: moviesWithRatings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    },
  });
});

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByPk(req.params.id, {
    include: [{
      model: Review,
      as: 'reviews',
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profilePic'],
      }],
      order: [['createdAt', 'DESC']],
    }],
  });

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found',
    });
  }

  // Calculate average rating
  const movieData = movie.toJSON();
  if (movieData.reviews && movieData.reviews.length > 0) {
    const avgRating = movieData.reviews.reduce((sum, review) => sum + review.rating, 0) / movieData.reviews.length;
    movieData.avgRating = Math.round(avgRating * 100) / 100;
  } else {
    movieData.avgRating = 0;
  }

  res.json({
    success: true,
    data: movieData,
  });
});

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private (Admin only)
const createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Movie created successfully',
    data: movie,
  });
});

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private (Admin only)
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found',
    });
  }

  await movie.update(req.body);

  res.json({
    success: true,
    message: 'Movie updated successfully',
    data: movie,
  });
});

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin only)
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found',
    });
  }

  await movie.destroy();

  res.json({
    success: true,
    message: 'Movie deleted successfully',
  });
});

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Public
const getTopRatedMovies = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const minReviews = parseInt(req.query.minReviews) || 3; // Minimum reviews required

  // Use raw SQL for better performance with complex aggregations
  const movies = await sequelize.query(`
    SELECT 
      m.*,
      COALESCE(AVG(r.rating), 0) as avgRating,
      COUNT(r.id) as reviewCount
    FROM Movies m
    LEFT JOIN Reviews r ON m.id = r.movieId
    GROUP BY m.id
    HAVING COUNT(r.id) >= :minReviews
    ORDER BY avgRating DESC, reviewCount DESC
    LIMIT :limit
  `, {
    replacements: { limit, minReviews },
    type: sequelize.QueryTypes.SELECT,
    raw: true
  });

  // Format the response
  const formattedMovies = movies.map(movie => ({
    ...movie,
    avgRating: parseFloat(movie.avgRating).toFixed(2),
    reviewCount: parseInt(movie.reviewCount),
  }));

  res.json({
    success: true,
    data: formattedMovies,
    metadata: {
      limit,
      minReviewsRequired: minReviews,
      totalReturned: formattedMovies.length,
    },
  });
});

// @desc    Get trending movies (recently popular)
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const days = parseInt(req.query.days) || 30; // Reviews from last N days

  const movies = await sequelize.query(`
    SELECT 
      m.*,
      COALESCE(AVG(r.rating), 0) as avgRating,
      COUNT(r.id) as recentReviewCount
    FROM Movies m
    LEFT JOIN Reviews r ON m.id = r.movieId 
      AND r.createdAt >= DATE_SUB(NOW(), INTERVAL :days DAY)
    GROUP BY m.id
    HAVING COUNT(r.id) > 0
    ORDER BY recentReviewCount DESC, avgRating DESC
    LIMIT :limit
  `, {
    replacements: { limit, days },
    type: sequelize.QueryTypes.SELECT,
    raw: true
  });

  const formattedMovies = movies.map(movie => ({
    ...movie,
    avgRating: parseFloat(movie.avgRating).toFixed(2),
    recentReviewCount: parseInt(movie.recentReviewCount),
  }));

  res.json({
    success: true,
    data: formattedMovies,
    metadata: {
      limit,
      daysConsidered: days,
      totalReturned: formattedMovies.length,
    },
  });
});

// @desc    Get movies by different categories
// @route   GET /api/movies/category/:category
// @access  Public
const getMoviesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  let query;
  let replacements = { limit };

  switch (category.toLowerCase()) {
    case 'latest':
      query = `
        SELECT m.*, COALESCE(AVG(r.rating), 0) as avgRating, COUNT(r.id) as reviewCount
        FROM Movies m
        LEFT JOIN Reviews r ON m.id = r.movieId
        GROUP BY m.id
        ORDER BY m.createdAt DESC
        LIMIT :limit
      `;
      break;

    case 'highest-rated':
      query = `
        SELECT m.*, COALESCE(AVG(r.rating), 0) as avgRating, COUNT(r.id) as reviewCount
        FROM Movies m
        LEFT JOIN Reviews r ON m.id = r.movieId
        GROUP BY m.id
        HAVING COUNT(r.id) >= 5
        ORDER BY avgRating DESC, reviewCount DESC
        LIMIT :limit
      `;
      break;

    case 'most-reviewed':
      query = `
        SELECT m.*, COALESCE(AVG(r.rating), 0) as avgRating, COUNT(r.id) as reviewCount
        FROM Movies m
        LEFT JOIN Reviews r ON m.id = r.movieId
        GROUP BY m.id
        HAVING COUNT(r.id) > 0
        ORDER BY reviewCount DESC, avgRating DESC
        LIMIT :limit
      `;
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Available categories: latest, highest-rated, most-reviewed',
      });
  }

  const movies = await sequelize.query(query, {
    replacements,
    type: sequelize.QueryTypes.SELECT,
    raw: true
  });

  const formattedMovies = movies.map(movie => ({
    ...movie,
    avgRating: parseFloat(movie.avgRating || 0).toFixed(2),
    reviewCount: parseInt(movie.reviewCount || 0),
  }));

  res.json({
    success: true,
    data: formattedMovies,
    metadata: {
      category,
      limit,
      totalReturned: formattedMovies.length,
    },
  });
});

// @desc    Get movies by genre
// @route   GET /api/movies/genre/:genre
// @access  Public
const getMoviesByGenre = asyncHandler(async (req, res) => {
  const { genre } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await Movie.findAndCountAll({
    where: {
      genre: { [Op.like]: `%${genre}%` },
    },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: {
      movies: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    },
  });
});

module.exports = {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getTopRatedMovies,
  getTrendingMovies,
  getMoviesByCategory,
  getMoviesByGenre,
};
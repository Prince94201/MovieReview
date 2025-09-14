const { Review, Movie, User, sequelize } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get reviews for a movie
// @route   GET /api/movies/:movieId/reviews
// @access  Public
const getMovieReviews = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Check if movie exists
  const movie = await Movie.findByPk(movieId);
  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found',
    });
  }

  const { count, rows } = await Review.findAndCountAll({
    where: { movieId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'profilePic'],
    }],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: {
      reviews: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    },
  });
});

// @desc    Create/Update a review
// @route   POST /api/movies/:movieId/reviews
// @access  Private
const createOrUpdateReview = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { rating, reviewText } = req.body;
  const userId = req.user.id;

  // Check if movie exists
  const movie = await Movie.findByPk(movieId);
  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found',
    });
  }

  // Check if user has already reviewed this movie
  let review = await Review.findOne({
    where: { userId, movieId },
  });

  if (review) {
    // Update existing review
    await review.update({ rating, reviewText });
    
    // Reload with user data
    await review.reload({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profilePic'],
      }],
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } else {
    // Create new review
    review = await Review.create({
      userId,
      movieId,
      rating,
      reviewText,
    });

    // Reload with user data
    await review.reload({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profilePic'],
      }],
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  }

  // Update movie's average rating
  await updateMovieRating(movieId);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByPk(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  // Check if user owns the review or is admin
  if (review.userId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this review',
    });
  }

  const movieId = review.movieId;
  await review.destroy();

  // Update movie's average rating
  await updateMovieRating(movieId);

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// @desc    Get user's reviews
// @route   GET /api/users/:userId/reviews
// @access  Public
const getUserReviews = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const { count, rows } = await Review.findAndCountAll({
    where: { userId },
    include: [{
      model: Movie,
      as: 'movie',
      attributes: ['id', 'title', 'posterUrl', 'releaseYear'],
    }],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: {
      reviews: rows,
      user: {
        id: user.id,
        username: user.username,
        profilePic: user.profilePic,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    },
  });
});

// @desc    Get current user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Debug logging
  console.log('getMyReviews - User ID:', req.user.id, 'Username:', req.user.username);

  const { count, rows } = await Review.findAndCountAll({
    where: { userId: req.user.id },
    include: [{
      model: Movie,
      as: 'movie',
      attributes: ['id', 'title', 'posterUrl', 'releaseYear'],
    }],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  console.log('getMyReviews - Found reviews:', rows.length, 'for user:', req.user.id);

  res.json({
    success: true,
    data: {
      reviews: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    },
  });
});

// Helper function to update movie's average rating
const updateMovieRating = async (movieId) => {
  const reviews = await Review.findAll({
    where: { movieId },
    attributes: ['rating'],
  });

  let avgRating = 0;
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    avgRating = Math.round((totalRating / reviews.length) * 100) / 100;
  }

  await Movie.update({ avgRating }, { where: { id: movieId } });
};

module.exports = {
  getMovieReviews,
  createOrUpdateReview,
  deleteReview,
  getUserReviews,
  getMyReviews,
};
const sequelize = require('../config/database');
const User = require('./User');
const Movie = require('./Movie');
const Review = require('./Review');
const Watchlist = require('./Watchlist');

// Define associations
User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews',
  onDelete: 'CASCADE',
});

Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Movie.hasMany(Review, {
  foreignKey: 'movieId',
  as: 'reviews',
  onDelete: 'CASCADE',
});

Review.belongsTo(Movie, {
  foreignKey: 'movieId',
  as: 'movie',
});

User.hasMany(Watchlist, {
  foreignKey: 'userId',
  as: 'watchlist',
  onDelete: 'CASCADE',
});

Watchlist.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Movie.hasMany(Watchlist, {
  foreignKey: 'movieId',
  as: 'watchlistedBy',
  onDelete: 'CASCADE',
});

Watchlist.belongsTo(Movie, {
  foreignKey: 'movieId',
  as: 'movie',
});

// Many-to-many relationship through Watchlist
User.belongsToMany(Movie, {
  through: Watchlist,
  foreignKey: 'userId',
  otherKey: 'movieId',
  as: 'watchedMovies',
});

Movie.belongsToMany(User, {
  through: Watchlist,
  foreignKey: 'movieId',
  otherKey: 'userId',
  as: 'watchers',
});

module.exports = {
  sequelize,
  User,
  Movie,
  Review,
  Watchlist,
};
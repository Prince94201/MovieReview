const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { username, email, password, profilePic } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: existingUser.email === email ? 'Email already registered' : 'Username already taken',
    });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    profilePic,
  });

  // Generate token
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token,
    },
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({
    where: { email },
    attributes: { include: ['password'] },
  });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Generate token
  const token = generateToken(user.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, profilePic } = req.body;
  const user = req.user;

  // Check if username or email is taken by another user
  if (username && username !== user.username) {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken',
      });
    }
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }
  }

  // Update user
  await user.update({
    username: username || user.username,
    email: email || user.email,
    profilePic: profilePic !== undefined ? profilePic : user.profilePic,
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id, {
    attributes: { include: ['password'] },
  });

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Update password
  await user.update({ password: newPassword });

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Get current user info (for debugging)
// @route   GET /api/auth/debug
// @access  Private
const debugUser = asyncHandler(async (req, res) => {
  console.log('Debug endpoint - User from token:', {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email
  });

  res.json({
    success: true,
    data: {
      user: req.user,
      timestamp: new Date().toISOString()
    },
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  debugUser,
};
const express = require('express');
const { register, login, getMe, updateProfile, debugUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/debug', protect, debugUser);
router.put('/profile', protect, updateProfile);

module.exports = router;
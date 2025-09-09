const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// /api/auth/register
router.post('/register', authController.register);

// /api/auth/login
router.post('/login', authController.login);

// /api/auth/me
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;

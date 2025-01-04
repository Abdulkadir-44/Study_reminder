const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Kullanıcı kaydı
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Kullanıcı girişi
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/forgot-password
// @desc    Şifre sıfırlama isteği gönder
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Şifreyi sıfırla
// @access  Public
router.post('/reset-password/:token', resetPassword);

module.exports = router;

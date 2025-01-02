const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Tüm route'lar private olduğu için protect middleware'ini kullanıyoruz
router.use(protect);

// @route   GET /api/users/profile
// @desc    Kullanıcı profilini getir
router.get('/profile', getProfile);

// @route   PUT /api/users/profile
// @desc    Kullanıcı profilini güncelle
router.put('/profile', updateProfile);

module.exports = router;


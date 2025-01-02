const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '4h', // 4 saat geçerli token
  });
};

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    console.log(req.body);
    // Email kontrolü
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kayıtlı'
      });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      fullName,
      email,
      password,
      phone
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        },
        token: generateToken(user._id)
      });
    }

  } catch (error) {
    console.error('Tam hata:', error);
    console.error('Hata stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : null
    });
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);
    // Email ve şifre kontrolü
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
    }

    // Şifre kontrolü
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      },
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('Tam hata:', error);
    console.error('Hata stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null
    });
  }
};

module.exports = {
  register,
  login
};

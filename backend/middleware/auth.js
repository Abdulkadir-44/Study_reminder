const jwt = require('jsonwebtoken');
const User = require('../models/User');


//bu bir middleware'dir.Ve token doğrulama için kullanılır.
const protect = async (req, res, next) => {
  try {
    let token;

    // Token'ı header'dan al
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Token yoksa hata döndür
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bu işlem için yetkiniz yok. Lütfen giriş yapın.'
      });
    }

    try {
      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı bul ve request nesnesine ekle,.select('-password'): Kullanıcıyı 
      //bulurken password alanını hariç tutar. Bu, hassas bilgilerin istemeden ifşa 
      //edilmesini önler.
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token. Lütfen tekrar giriş yapın.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

module.exports = { protect };

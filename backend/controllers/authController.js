const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/emailService');

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
      console.log("email geçersiz");
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
    }

    // Şifre kontrolü
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("şifre geçersiz");
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

// @desc    Şifre sıfırlama isteği gönder
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("forgot : ",email);
    // Email ile kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'
      });
    }

    // Reset token oluştur (1 saatlik)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Token'ı hash'le ve kaydet
    const hashedToken = await bcrypt.hash(resetToken, 10);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 saat
    await user.save();

    // Reset linkini oluştur
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email içeriği
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">Ders Programı</h1>
          <p style="color: #6B7280; margin-top: 10px;">Şifre Sıfırlama İsteği</p>
        </div>

        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #374151; margin-bottom: 15px;">Merhaba,</p>
          
          <p style="color: #374151; margin-bottom: 15px;">
            Hesabınız için bir şifre sıfırlama isteği aldık. Eğer bu isteği siz yaptıysanız, 
            aşağıdaki butona tıklayarak şifrenizi sıfırlayabilirsiniz.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Şifremi Sıfırla
            </a>
          </div>

          <p style="color: #374151; margin-bottom: 15px;">
            Bu link 1 saat boyunca geçerli olacaktır.
          </p>

          <p style="color: #374151; margin-bottom: 15px;">
            Eğer şifre sıfırlama isteğinde bulunmadıysanız, bu emaili görmezden gelebilirsiniz.
          </p>
        </div>

        <div style="text-align: center; color: #6B7280; font-size: 14px;">
          <p>Bu otomatik bir emaildir, lütfen cevaplamayınız.</p>
        </div>
      </div>
    `;

    // Email gönder
    await sendEmail({
      email: user.email,
      subject: 'Şifre Sıfırlama İsteği',
      message
    });

    res.json({
      success: true,
      message: 'Şifre sıfırlama linki email adresinize gönderildi'
    });

  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre sıfırlama işlemi başarısız oldu'
    });
  }
};

// @desc    Şifreyi sıfırla
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı bul
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz ya da süresi dolmuş token'
      });
    }

    // Token'ı kontrol et
    const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValidToken) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz token'
      });
    }

    // Direkt şifreyi ata, middleware hash'leyecek
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Şifreniz başarıyla güncellendi'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz token'
      });
    }
    
    console.error('Şifre güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre güncelleme işlemi başarısız oldu'
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};

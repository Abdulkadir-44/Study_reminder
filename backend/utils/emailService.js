require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

// Email transporter konfigürasyonu
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD2,
    type: 'login'
  },
  debug: true // Hata ayıklama için
});

// Belirli bir kullanıcının derslerini kontrol edip email gönder
const checkAndSendLessonReminder = async (userId) => {
  try {
    // Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Yarının gününü bul
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.toLocaleDateString('tr-TR', { weekday: 'long' });

    // Yarınki dersleri bul
    const tomorrowLessons = await Lesson.find({
      userId: user._id,
      dayOfWeek: tomorrowDay
    }).sort({ startTime: 1 });

    // Eğer yarın ders varsa email gönder
    if (tomorrowLessons.length > 0) {
      await sendLessonReminder(user.email, tomorrowLessons);
      return {
        success: true,
        message: 'Hatırlatma emaili gönderildi',
        lessonsCount: tomorrowLessons.length
      };
    }

    return {
      success: true,
      message: 'Yarın için ders bulunamadı',
      lessonsCount: 0
    };

  } catch (error) {
    console.error('Email gönderme hatası:', error);
    throw error;
  }
};

// Email gönderme fonksiyonu (mevcut fonksiyon)
const sendLessonReminder = async (userEmail, lessons) => {
  try {
    // HTML template oluştur
    const lessonList = lessons
      .map(lesson => `
        <div style="margin-bottom: 15px; padding: 10px; border-left: 4px solid #3b82f6; background-color: #f8fafc;">
          <h3 style="margin: 0; color: #1e3a8a;">${lesson.name}</h3>
          <p style="margin: 5px 0; color: #64748b;">
            Saat: ${lesson.startTime} - ${lesson.endTime}<br>
            Sınıf: ${lesson.classroom}<br>
            Öğretim Görevlisi: ${lesson.instructor}
          </p>
        </div>
      `)
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Yarınki Ders Programınız',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Yarınki Dersleriniz</h2>
          <p style="color: #475569;">Merhaba, yarın aşağıdaki dersleriniz bulunmaktadır:</p>
          ${lessonList}
          <p style="color: #475569; margin-top: 20px;">
            İyi çalışmalar dileriz!
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email gönderirken hata:', error);
    throw error;
  }
};

// Genel email gönderme fonksiyonu
const sendEmail = async ({ email, subject, message }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Ders Programı Uygulaması</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            ${message}
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            Bu email otomatik olarak gönderilmiştir. Lütfen cevaplamayınız.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendLessonReminder,
  checkAndSendLessonReminder
}; 
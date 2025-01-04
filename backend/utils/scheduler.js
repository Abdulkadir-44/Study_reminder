const cron = require('node-cron');
const User = require('../models/User');
const { checkAndSendLessonReminder } = require('./emailService');

// Her gün akşam 21:00'de çalışacak cron job
cron.schedule('0 22 * * *', async () => {
  try {
    console.log('Ders hatırlatma zamanı:', new Date().toLocaleString());
    
    // Tüm kullanıcıları bul
    const users = await User.find();
    
    // Her kullanıcı için kontrol et ve email gönder
    for (const user of users) {
      try {
        const result = await checkAndSendLessonReminder(user._id);
        console.log(`${user.email} için hatırlatma sonucu:`, result);
      } catch (error) {
        console.error(`${user.email} için hatırlatma gönderilemedi:`, error);
      }
    }
    
  } catch (error) {
    console.error('Scheduler hatası:', error);
  }
}); 
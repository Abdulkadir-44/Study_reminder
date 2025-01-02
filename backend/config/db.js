/*
Bu satırda, Mongoose kütüphanesi projeye dahil edilir. Mongoose, MongoDB ile çalışmayı 
kolaylaştıran bir ODM (Object Data Modeling) kütüphanesidir. Veritabanı işlemleri için 
gereklidir.

*/
const mongoose = require("mongoose");

//async çalışan fonksiyonlar promise dönderdikleri için try catch ile hata yönetimi yapıyoruz
const connectDB = async () => {
    try {
        //connect fonksiyonu bir promise döndürür
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        //Sonuç başarılıysa console'a bağlantı bilgilerini yazdırır
        console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB bağlantı hatası:", error);
        process.exit(1);
    }
}

module.exports = connectDB;
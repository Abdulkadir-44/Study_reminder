const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "İsim Soyisim alanı zorunludur !"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email alanı zorunludur !"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Geçersiz email adresi !"]
    },
    password: {
        type: String,
        required: [true, "Şifre alanı zorunludur !"],
        minlength: [6, "Şifre en az 6 karakter olmalıdır !"]
    },
    phone: {
        type: String,
        required: [true, "Telefon alanı zorunludur !"],
        trim: true,
        unique: true,
        match: [/^[0-9]{10}$/, "Geçersiz telefon numarası !"]
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);

/*
isModified Metodunun Mantığı
isModified metodu, Mongoose tarafından sağlanan bir yöntemdir. Bir dokümanın belirli bir 
alanının değişip değişmediğini kontrol etmek için kullanılır.

Nasıl Çalışır?

this.isModified(fieldName)

Eğer belirtilen fieldName (örneğin password) alanı oluşturulmuş ya da değiştirilmişse true 
döner.
Eğer belirtilen alan üzerinde herhangi bir değişiklik yapılmamışsa false döner.

İlk Kayıtta isModified('password')

İlk kayıtta password alanı henüz veritabanında olmadığı için bu alan yeni eklenmiş olarak 
kabul edilir.Bu nedenle isModified('password') ilk kayıtta true döner ve şifre hash'leme 
işlemi gerçekleşir.

Hangi Durumlarda False Döner?
Eğer password alanı üzerinde hiçbir değişiklik yapılmamışsa (örneğin, kullanıcı diğer 
bilgilerini güncelliyor ama şifreyi değiştirmiyor).
Şifre değiştirilmek istendiğinde, yeni değer eski değerle aynı ise (yani değişiklik 
olmuyorsa), bu durumda isModified yine false döner.

this Ne Temsil Eder?
İlk kayıtta: Kullanıcıdan gelen düz şifreyi.
Şifre değiştirmede: Kullanıcıdan gelen yeni düz şifreyi.

Middleware'ler:

pre: İşlemden önce çalışır.
post: İşlemden sonra çalışır.
Çeşitli middleware türleri (doküman, sorgu, model, vs.) vardır.
Yerleşik Mongoose Metotları:

Veri ekleme: save, create
Veri sorgulama: find, findOne, findById
Veri güncelleme: updateOne, findByIdAndUpdate
Veri silme: deleteOne, findByIdAndDelete
Özel Metotlar:

Instance: Doküman düzeyinde çalışır (matchPassword gibi).
Statik: Model düzeyinde çalışır (findByEmail gibi).

*/
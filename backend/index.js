require('./utils/scheduler');
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require('./routes/lessonRoutes');

//env dosyasını yapılandırıyoruz
dotenv.config();

//express ile app oluşturuyoruz
const app = express();

//cors ile cors policy oluşturuyoruz
app.use(cors());

//express ile json verileri okuyoruz
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//routerları tanımlıyoruz
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/lessons', lessonRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Sunucu ${PORT} portunda çalışıyor`);
        });
    })
    .catch((err) => {
        console.error('Veritabanı bağlantı hatası:', err);
        process.exit(1);
    });


/*
Auth route'larını oluşturma (/api/auth/register ve /api/auth/login)
2. User route'larını oluşturma
User controller'ı yazma
Tüm sistemi test etme
*/
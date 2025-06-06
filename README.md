# Study Reminder

## Proje Hakkında

**Study Reminder**, kullanıcıların ders çalışma ve görevlerini planlayıp takip edebileceği, hatırlatıcılar kurabileceği tam kapsamlı bir uygulamadır. Kullanıcılar, ders programlarını oluşturabilir, görev ekleyebilir ve belirledikleri zamanlarda bildirim alabilirler. Uygulama, modern web teknolojileriyle geliştirilmiş olup hem frontend hem de backend bileşenlerine sahiptir.

## Özellikler

- Kullanıcı kaydı ve girişi (JWT ile güvenli kimlik doğrulama)
- Ders ve görev ekleme, düzenleme, silme
- Zamanlanmış hatırlatıcılar (cron ile otomatik e-posta bildirimleri)
- Modern ve kullanıcı dostu arayüz
- Mobil uyumlu tasarım
- Bildirim sistemi
- Kişisel görev takibi

## Kullanılan Teknolojiler

### Frontend

- **React**: Kullanıcı arayüzü için
- **Redux Toolkit**: Global state yönetimi
- **React Router**: Sayfa yönlendirme
- **TailwindCSS**: Modern ve hızlı stil oluşturma
- **Vite**: Hızlı geliştirme ve derleme aracı
- **FontAwesome**: İkonlar
- **Framer Motion**: Animasyonlar
- **Headless UI**: Erişilebilir bileşenler

### Backend

- **Node.js & Express**: Sunucu ve API
- **MongoDB & Mongoose**: Veritabanı ve modelleme
- **JWT (jsonwebtoken)**: Kimlik doğrulama
- **Nodemailer**: E-posta gönderimi
- **Node-cron**: Zamanlanmış görevler
- **dotenv**: Ortam değişkenleri yönetimi
- **bcryptjs**: Şifreleme

## Kurulum ve Çalıştırma

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/Abdulkadir-44/Study_reminder.git
cd Study_reminder
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
# Ortam değişkenlerini .env dosyasına ekleyin
npm run dev
```

### 3. Frontend Kurulumu

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Kullanım

- Frontend genellikle `http://localhost:5173` adresinde çalışır.
- Backend ise `http://localhost:5000` gibi bir portta çalışır.
- Kendi MongoDB bağlantınızı ve e-posta ayarlarınızı `.env` dosyasına eklemelisiniz.

## Örnek .env Dosyası (Backend)

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---

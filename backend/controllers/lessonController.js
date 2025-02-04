const Lesson = require('../models/Lesson');
const { calculateTotalHours, filterCompletedLessons } = require('../utils/helper');
const { checkAndSendLessonReminder } = require('../utils/emailService');

// @desc    Ders oluştur
// @route   POST /api/lessons
// @access  Private
const createLesson = async (req, res) => {
  try {
    const { name, instructor, dayOfWeek, startTime, endTime, classroom, color, notes } = req.body;

    const lesson = await Lesson.create({
      userId: req.user.id,
      name,
      instructor,
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      color,
      notes
    });

    res.status(201).json({
      success: true,
      data: lesson,
      message: 'Ders başarıyla oluşturuldu !'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ders oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Kullanıcının tüm derslerini getir
// @route   GET /api/lessons
// @access  Private
const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ userId: req.user.id });

    res.json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Dersler getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Belirli bir dersi getir
// @route   GET /api/lessons/:id
// @access  Private
const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Ders bulunamadı'
      });
    }

    // Dersin bu kullanıcıya ait olduğunu kontrol et
    if (lesson.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ders getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Dersi güncelle
// @route   PUT /api/lessons/:id
// @access  Private
const updateLesson = async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Ders bulunamadı'
      });
    }

    // Dersin bu kullanıcıya ait olduğunu kontrol et
    if (lesson.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      });
    }

    lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: lesson,
      message: 'Ders başarıyla güncellendi !'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ders güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Dersi sil
// @route   DELETE /api/lessons/:id
// @access  Private
const deleteLesson = async (req, res) => {
  
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Ders bulunamadı'
      });
    }
    

    // Dersin bu kullanıcıya ait olduğunu kontrol et
    if (lesson.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      });
    }

    await lesson.deleteOne();

    res.json({
      success: true,
      message: 'Ders başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ders silinirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Bugünün derslerini getir
// @route   GET /api/lessons/today
// @access  Private
const getTodaysLessons = async (req, res) => {
  try {
    // Bugünün başlangıç ve bitiş zamanlarını ayarla
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('tr-TR', { weekday: 'long' }); // Örn: "Pazartesi"

    // Kullanıcının bugünkü derslerini bul
    const lessons = await Lesson.find({
      userId: req.user.id,
      dayOfWeek: dayOfWeek
    });

    // Toplam ders saatini hesapla
    const totalHours = lessons.reduce((total, lesson) => {
      const start = new Date(`2000-01-01 ${lesson.startTime}`);
      const end = new Date(`2000-01-01 ${lesson.endTime}`);
      const hours = (end - start) / (1000 * 60 * 60); // Saat cinsinden süre
      return total + hours;
    }, 0);
    res.json({
      success: true,
      count: lessons.length,
      // amaç çıkan saatleri 1 ondalık basamağa yuvarlamak,mesela 3.45 değerini 3.4 yapmak
      totalHours: Math.round(totalHours * 10) / 10, // 1 ondalık basamağa yuvarla
      lessons
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Bugünün dersleri getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Aktif hatırlatıcıları getir
// @route   GET /api/lessons/active-reminders
// @access  Private
const getActiveReminders = async (req, res) => {
  try {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const today = now.toLocaleDateString('tr-TR', { weekday: 'long' });
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      .toLocaleDateString('tr-TR', { weekday: 'long' });

    const lessons = await Lesson.find({
      userId: req.user._id,
      dayOfWeek: { $in: [today, tomorrow] }
    }).sort({ startTime: 1 });

    // Dersleri işle ve timeUntilStart ekle
    const activeLessons = lessons.filter(lesson => {
      const [hours, minutes] = lesson.startTime.split(':');
      const lessonDate = new Date();
      
      if (lesson.dayOfWeek === tomorrow) {
        lessonDate.setDate(lessonDate.getDate() + 1);
      }
      
      lessonDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      return lessonDate >= now && lessonDate <= next24Hours;
    }).map(lesson => {
      const [hours, minutes] = lesson.startTime.split(':');
      const lessonDate = new Date();
      
      if (lesson.dayOfWeek === tomorrow) {
        lessonDate.setDate(lessonDate.getDate() + 1);
      }
      
      lessonDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Kalan süreyi hesapla
      const timeDiff = lessonDate - now;
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      let timeUntilStart;
      if (hoursDiff > 0) {
        timeUntilStart = `${hoursDiff} saat ${minutesDiff} dakika`;
      } else {
        timeUntilStart = `${minutesDiff} dakika`;
      }
      
      return {
        ...lesson.toObject(),
        timeUntilStart
      };
    });

    res.json({
      success: true,
      count: activeLessons.length,
      data: activeLessons
    });

  } catch (error) {
    console.error('Aktif hatırlatıcıları getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Aktif hatırlatıcılar getirilirken bir hata oluştu'
    });
  }
};

// Dersin başlamasına kalan süreyi hesapla
const getTimeUntilStart = (startTime, isTomorrow = false) => {
  const now = new Date();
  const [hours, minutes] = startTime.split(':');
  const lessonTime = new Date();
  lessonTime.setHours(hours, minutes, 0);

  if (isTomorrow) {
    lessonTime.setDate(lessonTime.getDate() + 1);
  }

  const diffInMinutes = Math.floor((lessonTime - now) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika`;
  }
  return `${Math.floor(diffInMinutes / 60)} saat ${diffInMinutes % 60} dakika`;
};

// @desc    Get lesson progress
// @route   GET /api/lessons/progress
// @access  Private
const getLessonProgress = async (req, res) => {
  try {
    // Tüm dersleri getir
    const allLessons = await Lesson.find({ userId: req.user.id });

    // Toplam ders saatini hesapla
    const totalHours = calculateTotalHours(allLessons);

    // Tamamlanan dersleri filtrele ve saatlerini hesapla
    const completedLessons = filterCompletedLessons(allLessons);
    const completedHours = calculateTotalHours(completedLessons);

    res.json({
      success: true,
      totalHours: Math.round(totalHours * 10) / 10,
      completedHours: Math.round(completedHours * 10) / 10
    });

  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({
      success: false,
      message: 'İlerleme bilgisi hesaplanırken bir hata oluştu'
    });
  }
};

// @desc    Manuel olarak ders hatırlatması gönder
// @route   POST /api/lessons/send-reminder
// @access  Private
const sendManualReminder = async (req, res) => {
  try {
    const result = await checkAndSendLessonReminder(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hatırlatma gönderilirken bir hata oluştu'
    });
  }
};

module.exports = {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  getTodaysLessons,
  getActiveReminders,
  getTimeUntilStart,
  getLessonProgress,
  sendManualReminder
}; 
// Derslerin toplam süresini hesapla
const calculateTotalHours = (lessons) => {
  return lessons.reduce((total, lesson) => {
    const [startHour, startMinute] = lesson.startTime.split(':');
    const [endHour, endMinute] = lesson.endTime.split(':');
    
    const duration = 
      (parseInt(endHour) * 60 + parseInt(endMinute)) - 
      (parseInt(startHour) * 60 + parseInt(startMinute));
    
    return total + (duration / 60);
  }, 0);
};

// Tamamlanan dersleri filtrele
const filterCompletedLessons = (lessons) => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('tr-TR', { weekday: 'long' });
  const currentTime = now.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  const dayOrder = {
    'Pazartesi': 1,
    'Salı': 2,
    'Çarşamba': 3,
    'Perşembe': 4,
    'Cuma': 5,
    'Cumartesi': 6,
    'Pazar': 7
  };

  return lessons.filter(lesson => {
    if (lesson.dayOfWeek === currentDay) {
      return lesson.endTime < currentTime;
    }
    return dayOrder[lesson.dayOfWeek] < dayOrder[currentDay];
  });
};

module.exports = {
  calculateTotalHours,
  filterCompletedLessons
}; 
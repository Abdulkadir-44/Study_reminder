import { toast } from 'sonner';
import { getTodaysLessons, getActiveReminders, getLessonProgress } from '../services/index';

export const fetchDashboardData = {
  // Bugünün derslerini getir
  fetchTodaysLessons: async (setTodaysLesson , setTodaysLessonsArray) => {
    try {
      const response = await getTodaysLessons();
      setTodaysLesson(response);
      setTodaysLessonsArray(response.lessons);
    } catch (error) {
      toast.error('Dersler yüklenirken bir hata oluştu');
    }
  },

  // Aktif hatırlatıcıları getir
  fetchActiveReminders: async (setActiveReminders) => {
    try {
      const response = await getActiveReminders();
      // console.log('Backend response:', response);

      // Eğer response veya data yoksa boş değerlerle devam et
      const reminders = response?.data || [];
      
      setActiveReminders({
        total: reminders.length,
        todayCount: reminders.filter(
          reminder => reminder.dayOfWeek === new Date().toLocaleDateString('tr-TR', { weekday: 'long' })
        ).length,
        reminders: reminders
      });
    } catch (error) {
      console.error('Hatırlatıcı hatası:', error);
      toast.error('Hatırlatıcılar yüklenirken bir hata oluştu');
      
      // Hata durumunda varsayılan değerler set et
      setActiveReminders({
        total: 0,
        todayCount: 0,
        reminders: []
      });
    }
  },

  // İlerleme durumunu getir
  fetchProgress: async (setProgress) => {
    try {
      const response = await getLessonProgress();
      const { totalHours, completedHours } = response;
      const percentage = Math.round((completedHours / totalHours) * 100);
      
      setProgress({
        totalHours,
        completedHours,
        percentage
      });
    } catch (error) {
      toast.error('İlerleme bilgisi yüklenirken bir hata oluştu');
    }
  }
}; 
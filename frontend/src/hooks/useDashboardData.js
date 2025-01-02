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
      setActiveReminders({
        total: response.reminders.length,
        todayCount: response.reminders.filter(
          reminder => reminder.dayOfWeek === new Date().toLocaleDateString('tr-TR', { weekday: 'long' })
        ).length,
        reminders: response.reminders
      });
    } catch (error) {
      toast.error('Hatırlatıcılar yüklenirken bir hata oluştu');
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
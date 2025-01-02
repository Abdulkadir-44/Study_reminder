import { get, post, put, del } from './request';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Yeni ders oluştur
const createLesson = (data) => post(`${BASE_URL}/lessons`, data);

// Tüm dersleri getir
const getLessons = () => get(`${BASE_URL}/lessons`);

// Belirli bir dersi getir
const getLessonById = (id) => get(`${BASE_URL}/lessons/${id}`);

// Ders güncelle
const updateLesson = (id, data) => put(`${BASE_URL}/lessons/${id}`, data);

// Ders sil
const deleteLesson = (id) => del(`${BASE_URL}/lessons/${id}`);

// Bugünkü dersleri getir
const getTodaysLessons = () => get(`${BASE_URL}/lessons/today`);

// Aktif hatırlatıcıları getir
const getActiveReminders = () => get(`${BASE_URL}/lessons/active-reminders`);

// Ders ilerleme durumunu getir
const getLessonProgress = () => get(`${BASE_URL}/lessons/progress`);

export {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
  getTodaysLessons,
  getActiveReminders,
  getLessonProgress
}; 
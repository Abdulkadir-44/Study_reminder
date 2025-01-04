const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  getTodaysLessons,
  getActiveReminders,
  getLessonProgress,
  sendManualReminder
} = require('../controllers/lessonController');

router.use(protect); // Tüm routes'ları koruma altına al

router.route('/')
  .post(createLesson)
  .get(getLessons);

router.get('/today', getTodaysLessons);
router.get('/active-reminders', getActiveReminders);
router.get('/progress', getLessonProgress);

router.route('/:id')
  .get(getLesson)
  .put(updateLesson)
  .delete(deleteLesson);

router.post('/send-reminder', sendManualReminder);

module.exports = router; 
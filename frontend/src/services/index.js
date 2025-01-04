import { login } from "./loginService";
import { register } from "./registerService";
import { createLesson, getLessons, getLessonById, updateLesson, deleteLesson, getTodaysLessons, getActiveReminders,getLessonProgress } from "./lessonService";
import { forgotPassword, resetPassword } from "./passwordService";
export {
    login,
    register,
    createLesson,
    getLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
    getTodaysLessons,   
    getActiveReminders,
    getLessonProgress,
    forgotPassword,
    resetPassword   
};
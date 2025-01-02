const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: [true, "Ders adı zorunludur !"]
    },
    instructor: {
        type: String,
        required: [true, "Öğretmen adı zorunludur !"]
    },
    dayOfWeek: {
        type: String,
        required: [true, "Gün zorunludur !"],
        enum: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]
    },
    startTime: {
        type: String,
        required: [true, "Başlangıç saati zorunludur !"]
    },
    endTime: {
        type: String,
        required: [true, "Bitiş saati zorunludur !"]
    },
    classroom: {
        type: String,
        required: [true, "Sınıf bilgisi zorunludur !"]
    },
    color: {
        type: String,
        default: "#3B82F6"
    },
    notes: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model("Lesson", LessonSchema);
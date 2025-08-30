import mongoose from 'mongoose'

const lessonProgressSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true},
    completed: { type: Boolean, default: false},
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true},
},    { timestamps: true}

)

export default mongoose.model("LessonProgress", lessonProgressSchema)
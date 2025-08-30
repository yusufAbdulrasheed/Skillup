import Course from '../../models/courseModel.js'
import Lesson from '../../models/lessonModel.js'
import LessonProgress from '../../models/lessonProgressModel.js' 
import cloudinary from '../../config/cloudinary.js'
import Enrollment from '../../models/enrollmentModel.js'
import mongoose from 'mongoose'

const addLesson = async (req, res) => {
    try{

        const { courseId } = req.params
        const { title, content, order } = req.body

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            })
        }

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        if(course.instructor.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not the instructor of this course."
            })
        }

        let videoUrl = null
        if(req.file){
            try{
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: "video",
                    folder: "lessons_videos"
                })
                videoUrl = uploadResult.secure_url
            }
            catch(err){
                return res.status(500).json({
                    success: false,
                    message: "Video upload failed"
                })
            }
        }

        const newLesson = await Lesson.create({
            title,
            content,
            videoUrl,
            order,
            course: courseId
        })

        course.lessons.push(newLesson._id)
        await course.save()

        return res.status(201).json({
            success: true,
            message: "Lesson added successfully",
            lesson: newLesson
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

const updateLesson = async (req, res) =>{
    try{

        const { lessonId } = req.params
        const { title, content, order } = req.body

        const lesson = await Lesson.findById(lessonId).populate('course')
        if(!lesson){
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            })
        }

        if(lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not the instructor of this course."
            })
        }

        if(req.file){
            try{
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: "video",
                    folder: "lessons_videos"
                })
                lesson.videoUrl = uploadResult.secure_url
            }
            catch(err){
                return res.status(500).json({
                    success: false,
                    message: "Video upload failed"
                })
            }
        }

        if(title) lesson.title = title
        if(content) lesson.content = content
        if(order) lesson.order = order

        await lesson.save()

        return res.status(200).json({
            success: true,
            message: "Lesson updated successfully",
            lesson
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

const deleteLesson = async (req, res) =>{
    try{

        const { lessonId } = req.params

        const lesson = await Lesson.findById(lessonId).populate('course')
        if(!lesson){
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            })
        }

        if(lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not the instructor of this course."
            })
        }

        await Course.findByIdAndUpdate(lesson.course.id, { $pull: { lessons: lessonId }})

        await Lesson.findByIdAndDelete(lessonId)

        return res.status(200).json({
            success: true,
            message: "Lesson deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

const getLessonCourse = async (req, res) =>{
    try{

        const { courseId } = req.params

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            })
        }

        const lessons = await Lesson.find({ course: courseId }).sort({ order: 1})

        return res.status(200).json({
            success: true,
            total: lessons.length,
            lessons
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

const markLessonProgress = async (req, res) => {
    try{

        const { courseId, lessonId } = req.params
        const studentId = req.user.id

        if(req.user.role !== 'student'){
            return res.status(403).json({
                success: false,
                message: "Access denied. Only students can mark lesson progress."
            })
        }

        const lesson = await Lesson.findById(lessonId)
        if(!lesson){
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            })
        }

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        const enrollment = await Enrollment.findOne({ student: studentId, course: courseId })

        if(!enrollment){
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not enrolled in this course."
            })
        }

        let progress = await LessonProgress.findOne({
            student: studentId,
            lesson: lessonId,
            course: courseId
        })

        if(progress){
            progress.completed = true
            await progress.save()
        }
        else{
            progress = await LessonProgress.create({
                student: studentId,
                lesson: lessonId,
                course: courseId,
                completed: true
            })
        }

        return res.status(200).json({
            success: true,
            message: "Lesson marked as completed",
            progress
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

export default{
    addLesson,
    updateLesson,
    deleteLesson,
    getLessonCourse,
    markLessonProgress
}
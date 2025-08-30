import User from '../../models/usersModel.js'
import Enrollment from '../../models/enrollmentModel.js'
import cloudinary from '../../config/cloudinary.js'
import LessonProgress from '../../models/lessonProgressModel.js'
import Lesson from '../../models/lessonModel.js'
import Review from '../../models/reviewsModel.js'

const updateStudentProfile = async (req, res) =>{
    try{

        const studentId = req.user.id
        const { name, email, bio } = req.body

        let student = await User.findById(studentId)
        if(!student){
            return res.status(404).json({
                success: false,
                message: "Student not found"
            })
        }

        let avatarUrl = student.avatar
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "auto",
                folder: "Student_media"
            })

            avatarUrl = result.secure_url
        }

        student.name = name || student.name
        student.email = email || student.email
        student.bio = bio || student.bio 
        student.avatar = avatarUrl

        await student.save()

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: student 
        })
        
    }

    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

const viewEnrolledCourse = async(req, res) =>{
    try{

        const studentId = req.user.id

        const enrollments = await Enrollment.find({ student: studentId }).populate({
            path: "course",
            select: "title description category thumbnail instructor lesson price isPublished"
        })

        if(!enrollments || enrollments.length === 0){
            return res.status(404).json({
                success: false,
                message: "You have not enrolled in any course yet"
            })
        }

        return res.status(200).json({
            success: true,
            count: enrollments.length,
            courses: enrollments.map(enrollment => enrollment.course)
        })
    }

    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

const trackLessonProgress = async (req, res) =>{
    try{
        const { lessonId } = req.params
        const { completed } = req.body
        const studentId = req.user._id

        const lesson = await Lesson.findById(lessonId)
        if(!lesson){
            return res.status(404).json({
                success: false,
                message: "lesson not found"
            })
        }

        const enrollment = await Enrollment.findOne({ student: studentId, course: lesson.course })
        if(!enrollment){
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course"
            })
        }

        let lessonProgress = await LessonProgress.findOne({ student: studentId, lesson: lessonId })
        
        if(lessonPregress){
            if((lessonProgress && lessonProgress.completed) && completed){
            return res.status(400).json({
                success: false,
                message: "Lesson already marked as completed"
            })
        }

        progress.completed = completed
        await lessonProgress.save()
        } else{
            lessonProgress = new LessonProgress({
                student: studentId,
                course: lessonId.course,
                lesson: lessonId,
                completed: completed
            })
        }
            return res.status(200).json({
                success: true,
                message: "Lesson progress updated successfully",
                data: lessonProgress
            })
        


    }

    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
} 

const submitCourseReview = async (req, res) =>{

    try{
        const { courseId } = req.params
        const { rating, comment } = req.body
        const studentId = req.user._id

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        const isEnrolled = await course.students?.includes(studentId)
        if(!isEnrolled){
            return res.status(403).json({
                success: false,
                message: "You must be enrolled in the course to submit a review"
            })
        }

        const existingReview = await Review.findOne({ course: courseId, student: studentId})
        if(existingReview){
            return res.status(400).json({
                success: false,
                message: "You have already submitted a review for this course"
            })
        }

        const review = await Review.create({
            course: courseId,
            student: studentId,
            rating,
            comment
        })

        return res.status(201).json({
            success: true,
            message: "Review Submitted successfully",
            data: review
        })
    }
    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

export default {
    updateStudentProfile,
    viewEnrolledCourse,
    trackLessonProgress,
    submitCourseReview
}
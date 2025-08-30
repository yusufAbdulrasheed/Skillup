import User from '../../models/usersModel.js'
import Course from '../../models/courseModel.js'
import cloudinary from '../../config/cloudinary.js'
import Lesson from '../../models/lessonModel.js'
import Enrollment from '../../models/enrollmentModel.js'

const updateInstructorProfile = async (req, res) =>{

    try{

        const instructorId = req.user.id
        const { name, bio } = req.body

        const instructor = await User.findById(instructorId)
        if(!instructor || instructor.role !== 'instructor'){
            return res.status (403).json({
                success: false,
                message: "Access denied. Only instructors can update profile."
            })
        }

        if(req.file){
            const uploadImage = await cloudinary.uploader.upload(req.file.path, {
                folder: 'instructor_profiles',
                width:500,
                height: 500,
                crop: "fill" 
            })

            instructor.avatar = uploadImage.secure_url
        }

        if(name) instructor.name = name
        if(bio) instructor.bio = bio
        
        await instructor.save()

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            instructor
        })

    }

    catch(err){
        return res.status(500).json({message: err.message})
    }
}

const createCourse = async (req, res) =>{
    try{
        
        const instructorId = req.user.id
        const { title, description, price, category } = req.body

        const instructor = await User.findById(instructorId)
        if(!instructor || instructor.role !== 'instructor'){
            return res.status(403).json({
                success: false,
                message: "Access denied. Only instructors can create courses."
            })
        }

        if(!title || !description || !category || !price){
            return res.status(400).json({
                success: false,
                message: "Title, description, category, and price are required to create a course."
            })
        }

        let thumbnail = null
        if(req.file){
            try{
                const uploadImage = await cloudinary.uploader.upload(req.file.path, {
                folder: 'course_thumbnails',
                width: 500,
                height: 500,
                crop: "fill"
            })

            thumbnail = uploadImage.secure_url

            }
            catch(err){
                return res.status(500).json({
                    message: "Image upload failed",
                    error: err.message
                })
            }
        } 

        const newCourse = await Course.create({
            title,
            description,
            category,
            price, 
            thumbnail,
            instructor: instructorId
        })

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course: newCourse
        })


    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}


const updateCourse = async (req, res) =>{

    try{

        const instructorId = req.user.id
        const { courseId } = req.params

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        if( course.instructor.toString() !== instructorId){
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not the instructor of this course."
            })
        }

        if(req.file){
            const uploadImage = await cloudinary.uploader.upload(req.file.path, {
                folder: 'course_thumbnails',
                width: 500,
                height: 500,
                crop: "fill"
            })

            req.body.thumbnail = uploadImage.secure_url
        }

        const updatedCourse = await Course.findByIdAndUpdate( courseId, req.body, { 
            new: true,
            runValidators: true
        })

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: updatedCourse
        })

    }

    catch(err){
        return res.status(500).json({message: err.message})
    }
}

const deleteCourse = async (req, res) =>{
    try{

        const instructorId = req.user.id
        const { courseId } = req.params

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        if(course.instructor.toString() !== instructorId){
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not the instructor of this course."
            })
        }

        await course.deleteOne()

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

const viewCourse = async (req, res) =>{
    try{

        const instructorId = req.user.id
        const courses = await Course.find({ instructor: instructorId })

        return res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            courses
        })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}
const uploadLesson = async (req, res) =>{
    try{
        const instructorId = req.user.id
        const { courseId } = req.params
        const { title, content, order } = req.body

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        if (course.instructor.toString() !== instructorId){
            return res.status(403).json({
                success: false,
                message: "Access denied. Only an instructor can upload lesson."
            })
        }

        let videoUrl = null
        if(req.file){
            const uploadVideo = await cloudinary.uploader.upload(req.file.path, {
                folder: "lessons_videos",
                resource_type: "video",
                chunk_size: 6000000,

            })

            videoUrl = uploadVideo.secure_url
        }

        const lesson = await Lesson.create({
            title,
            content,
            videoUrl,
            order,
            course: courseId
        })

        course.lessons.push(lesson._id)
        await course.save()

        return res.status(201).json({
            success: true,
            message: "Lesson uploaded successfully",
            lesson
        })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}


const viewEnrolledStudents = async (req, res) =>{
    try{
        const instructorId = req.user.id
        const { courseId } = req.params

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        if( course.instructor.toString() !== instructorId){
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not the instructor of this course."
            })
        }

        const enrollments = await Enrollment.find({ course: courseId}).populate('student', 'name email avatar')

        return res.status(200).json({
            success: true,
            count: enrollments.length,
            students: enrollments.map(e => e.student)
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

export default {
    updateInstructorProfile,
    createCourse,
    updateCourse,
    deleteCourse,
    viewCourse,
    uploadLesson,
    viewEnrolledStudents
}
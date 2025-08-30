import User from '../../models/usersModel.js'
import Course from '../../models/courseModel.js'
import mongoose from 'mongoose'

const getAllCourses = async (req, res) =>{
    try{
        const courses = await Course.find({ isPublished: true }).populate('instructor', 'name email').sort({ createdAt: -1})

        return res.status(200).json({
            success: true,
            count: courses.length,
            courses
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

const getCourseDetails = async (req, res) =>{
    try{

        const { courseId } = req.params

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            })

        }

        const course = await Course.findById(courseId).populate('instructor', 'name email').populate('lessons')

        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        return res.status(200).json({
            success: true,
            course
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

const togglePublishedCourse = async (req, res) =>{
    try{
        const { courseId } = req.params
        const instructorId = req.user.id

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        if(course.instructor.toString() !== instructorId.toString() && req.user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not the instructor of this course."
            })
        }

        course.isPublished = !course.isPublished
        const updatedCourse = await course.save()

        return res.status(200).json({
            success: true,
            message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
            course: updatedCourse
        })

    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

const searchCourse = async (req, res) => {
    try{
        const { keyword, category } = req.query
        let query = { isPublished: true }

        if(keyword){
            query.$or = [
                { title: {$regex: keyword, $options: "i"}},
                { description: {$regex: keyword, $options: "i"}}
            ]
        }

        if(category){
            query.category = category
        }

        const courses = await Course.find(query).populate('instructor', 'name email').sort({ createdAt: -1})

        return res.status(200).json({
            success: true,
            count: courses.length,
            courses
        })

    }

    catch(err){
        return res.status(500).json({message: err.message})
    }
}

export default {
    getAllCourses,
    getCourseDetails,
    togglePublishedCourse,
    searchCourse
}
import Course from '../../models/courseModel.js'
import User from '../../models/usersModel.js'
import Enrollment from '../../models/enrollmentModel.js'
import Reviews from '../../models/reviewsModel.js'
import { sendEmail } from '../../utils/sendMail.js'

const approveInstructor = async (req, res) =>{
    try{
        const { instructorId } = req.params

        const instructor = await User.findById(instructorId)

        if(!instructor){
            return res.status(404).json({
                message: "Instructor not found"
            })
        }

        if(instructor.role !== 'instructor'){
            return res.status(400).json({
                message: "User is not an instructor"
            })
        }

        instructor.status = "approved"
        await instructor.save()

        await sendEmail({
            to: instructor.email,
            subject: "Your Instructor Account has been Approved 🥳🥳🥳",
            html: `
                <h1>Hi 👋👋 ${instructor.name},</h1>
                <p>Congratulations! Your Instructor account at <strong>Skill Up</strong> has been Approved. </p>
                <p>You can now Proceed to create and publish courses 🚀🚀🚀</p>
            
            `
        })

        res.status(200).json({
            message: "Instructor approved Successfully",
            instructor
        })

    }
    catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

const rejectInstructor = async (req, res) =>{
    try{

        const { instructorId } = req.params

        const instructor = await User.findById( instructorId )

        if(!instructor){
            return res.status(404).json({
                message: "Instructor not found"
            })
        }

        if(instructor.role !== 'instructor'){
            return res.status(400).json({
                message: "User is not an Instructor"
            })
        }

        instructor.status = "rejected"
        await instructor.save()

        await sendEmail({
            to: instructor.email,
            subject: "Your Instructor Application was Rejected",
            html: `
                <h1>Hi ${instructor.name},</h1>
                <p>Sorry to inform you 😔😔😔, your instructor application at <strong>Skill Up</strong> was rejected</p>
                <p>If you believe this is a mistake, please contact Support</p>
            
            `
        })

        return res.status(200).json({
            message:"Instructod Rejected successfully",
            instructor
        })

    }
    catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

const blockStudent = async(req, res) =>{
    try{
        
        const { studentId } = req.params

        const student = await User.findById(studentId)
        if(!student) return res.status(404).json({ message: "Student not found"})

        if(student.role !== "student"){
            return res.status(400).json({ message: "User is not a Student"})
        }

        student.isBlocked = true
        await student.save()

        await sendEmail({
            to: student.email,
            subject: "Account Blocked",
            html: `
                <h1>Hi ${student.name},</h1>
                <p>Sorry to inform you 😔😔😔, that you have been blocked from accessing <strong>Skill Up</strong></p>
                <p>If you believe this is a mistake, please contact Support</p>
            
            `
        })

        return res.status(200).json({
            message: "Student blocked Successfully",
            student:{
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                isBlocked: student.isBlocked
            }
        })
    }
    catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

const approveCourse = async(req, res) => {
    try{

        const { courseId } = req.params

        const course = await Course.findById(courseId).populate("instructor", "name email")
        if(!course){
            return res.status(404).json({
                message: "Course not found"
            })
        }

        course.isPublished = true
        await course.save()

        return res.status(200).json({
            message: "Course approved and Published Successfully",
            course:{
                id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                thumbnail: course.thumbnail,
                instructor: course.instructor,
                lessons: course.lessons,
                price: course.price,
                isPublished: course.isPublished

            }
        })
    }
    catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

const rejectCourse = async (req, res) =>{
    try{

        const { courseId } = req.params
        const { reason } = req.body

        const course = await Course.findById(courseId).populate("instructor", "name email")
        if(!course){
            return res.status(404).json({
                message: "Course not Found"
            })
        }

        course.isRejected = true
        course.isPublished = false
        course.rejectionReason = reason || "Not Specified"
        await course.save()

        return res.status(200).json({
            message: "Course Rejected Successfully",
            course
        })
    }
    catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

const assignInstructorToCourse = async (req, res) =>{
    try{

        const { courseId, instructorId } = req.body

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        const instructor = await User.findById(instructorId)
        if(!instructor || instructor.role !== "instructor"){
            return res.status(400).json({
                success: false,
                message: "User is not an Instructor "
            })
        }

        course.instructor = instructorId
        await course.save()

        return res.status(200).json({
            success: true,
            message: "Instructor Assigned to Course Successfully",
            course
        })
    }

    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

const viewAllEnrollment = async (req, res) =>{
    try{

        const enrollments = await Enrollment.find()
        .populate("student", "name email")
        .populate("course", "title description")

        return res.status(200).json({
            success: true,
            count: enrollments.length,
            enrollments
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error fetching enrollments",
            error
        })
    }
}

const viewAllReviews = async (req, res) =>{
    try{

        const reviews = await Reviews.find()
        .populate("student", "name email")
        .populate("course", "title")

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error fetching enrollments",
            error
        })
    }
}
export default {
    approveInstructor,
    rejectInstructor,
    blockStudent,
    approveCourse,
    rejectCourse,
    viewAllEnrollment,
    viewAllReviews,
    assignInstructorToCourse
}
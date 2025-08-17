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

export default {
    approveInstructor,
    rejectInstructor
}
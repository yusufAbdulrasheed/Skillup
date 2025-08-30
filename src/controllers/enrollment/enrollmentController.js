import Stripe from 'stripe'
import Enrollment from '../../models/enrollmentModel.js'
import Course from '../../models/courseModel.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const enrollCourse = async (req, res) =>{
    try{

        const { courseId } = req.params
        const studentId = req.user.id
    
    
        const course = await Course.findById(courseId)

        if(!course){
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            })
        }

        if(!course.isPublished || course.isRejected){
            return res.status(400).json({
                success:false,
                message: 'Course is not available for enrollment'
            })
        }

        const existingEnrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
        })

        if(existingEnrollment){
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course'
            })
        }

        // if (!process.env.FRONTEND_URL) {
        //     console.error('FRONTEND_URL environment variable is not set')
        //     return res.status(500).json({
        //         success: false,
        //         message: 'Server configuration error'
        //     })
        // }   

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.title,
                            description: course.description,
                            images: [course.thumbnail],
                        },
                        unit_amount: course.price * 100,    
                    },
                    quantity: 1,
                }
            ],
            success_url: `${process.env.FRONTEND_URL}/payment-success?courseId=${courseId}`,
            cancel_url: `${process.env.FRONTEND_URL}/course/${courseId}`,
        })

        return res.status(200).json({
            status: 'success',
            message: "Payment ",
            sessionUrl: session.url,
        })
    
    }
    catch(error){
        console.error('Error creating checkout session:', error);
        res.status(500).json({ status: 'fail', message: 'Server Error' });
    }
}

const verifyAndConfirmEnrollment = async (req, res) =>{
    try{

        const { sessionId, courseId } = req.body
        const studentId = req.user.id

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if(!session || session.payment_status !== 'paid'){
            return res.status(400).json({
                success: false,
                message: 'Payment not completed'
            })
        }

        const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId })
        if(existingEnrollment){
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course'
            })
        }

        const newEnrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            payment_info: {
                paymentId: session.payment_intent,
                amount: session.amount_total / 100,
                currency: session.currency,
                paymentMethod: session.payment_method_types[0],
                status: session.payment_status,
            },
            enrolledAt: Date.now(),
            progress: 0,
        })

        return res.status(200).json({
            status: 'success',
            message: 'Enrollment confirmed',
            enrollment: newEnrollment,
        })


    }
    catch(error){
        console.error('Error verifying payment:', error);
        res.status(500).json({ status: 'fail', message: 'Server Error' });
    }
}

const cancelEnrollment = async (req, res) =>{
    try{

        const { courseId } = req.params
        const studentId = req.user.id

        const enrollment = await Enrollment.findOneAndDelete({ student: studentId, course: courseId})

        if(!enrollment){
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Enrollment cancelled successfully',
        })

    }catch(error){
        console.error('Error cancelling enrollment:', error);
        res.status(500).json({ status: 'fail', message: 'Server Error' });
    }
}

const getEnrolledCourses = async (req, res) =>{
    try{

        const studentId = req.user.id

        const enrollments = await Enrollment.find({ student: studentId }).populate('course')

        return res.status(200).json({
            success: true,
            total: enrollments.length,
            courses: enrollments.map(e => e.course)
        })
    }catch(error){
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ status: 'fail', message: 'Server Error' });
    }
}

const getStudentInCourse = async (req, res) =>{
    try{

        const { courseId } = req.params

        const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email avatar')

        return res.status(200).json({
            success: true,
            total: enrollments.length,
            students: enrollments.map(e => e.student)
        })
    }catch(error){
        console.error('Error fetching students in course:', error);
        res.status(500).json({ status: 'fail', message: 'Server Error' });
    }
}

export default {
    enrollCourse,
    verifyAndConfirmEnrollment,
    cancelEnrollment,
    getEnrolledCourses,
    getStudentInCourse
}
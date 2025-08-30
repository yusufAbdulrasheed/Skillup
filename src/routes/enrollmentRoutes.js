import express from 'express'

const router = express.Router()
import enrollmentController from '../controllers/enrollment/enrollmentController.js'
import { verifyToken, authorize } from '../middlewares/authMiddleware.js'

router.post('/checkout-session/:courseId', verifyToken, authorize('student'), enrollmentController.enrollCourse)
router.post('/verify-payment', verifyToken, authorize('student'), enrollmentController.verifyAndConfirmEnrollment)
router.delete('/cancel-enrollment/:courseId', verifyToken, authorize('student'), enrollmentController.cancelEnrollment)
router.get('/my-courses', verifyToken, authorize('student'), enrollmentController.getEnrolledCourses)
router.get('/students/:courseId', verifyToken, authorize('instructor', 'admin'), enrollmentController.getStudentInCourse)



export default router
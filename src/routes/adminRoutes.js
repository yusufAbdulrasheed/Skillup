import express from 'express'
const router = express.Router()
import adminController from '../controllers/admin/adminController.js'
import { verifyToken, authorize} from '../middlewares/authMiddleware.js'



router.put('/approve-instructor/:instructorId', verifyToken, authorize('admin'), adminController.approveInstructor)
router.put('/reject-instructor/:instructorId', verifyToken, authorize('admin'), adminController.rejectInstructor)
router.put('/block-student/:studentId', verifyToken, authorize('admin'), adminController.blockStudent)
router.put('/approve-course/:courseId', verifyToken, authorize('admin'), adminController.approveCourse)
router.put('/reject-course/:courseId', verifyToken, authorize('admin'), adminController.rejectCourse)
router.get('/enrollments', verifyToken, authorize('admin'), adminController.viewAllEnrollment)
router.get('/reviews', verifyToken, authorize('admin'), adminController.viewAllReviews)
router.put('/assign-instructor/:courseId', verifyToken, authorize('admin'), adminController.assignInstructorToCourse)



export default router
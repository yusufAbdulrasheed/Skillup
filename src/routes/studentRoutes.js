import express from 'express'
const router = express.Router()
import studentController from '../controllers/student/studentController.js'
import { verifyToken, authorize} from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multer.js'

router.put('/update-profile', verifyToken, authorize('student'),upload.single("file"), studentController.updateStudentProfile)
router.get('/enrolled-courses', verifyToken, authorize('student'), studentController.viewEnrolledCourse)
router.post('/track-lesson-progress/:lessonId', verifyToken, authorize('student'), studentController.trackLessonProgress)
router.post('/submit-review/:courseId', verifyToken, authorize('student'), studentController.submitCourseReview)


export default router 
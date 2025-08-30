import express from 'express'

const router = express.Router()
import instructorController from '../controllers/instructor/instructorController.js'
import { verifyToken, authorize} from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multer.js'


router.put('/update-profile', verifyToken, authorize('instructor'), upload.single("file"), instructorController.updateInstructorProfile)
router.post('/create-course', verifyToken, authorize('instructor'), upload.single("file"), instructorController.createCourse)
router.put('/update-course/:courseId', verifyToken, authorize('instructor'), upload.single("file"), instructorController.updateCourse)
router.delete('/delete-course/:courseId', verifyToken, authorize('instructor'), instructorController.deleteCourse)
router.get('/my-courses', verifyToken, authorize('instructor'), instructorController.viewCourse)
router.post('/add-lesson/:courseId', verifyToken, authorize('instructor'), upload.single("file"), instructorController.uploadLesson)
router.get('/enrolled-students/:courseId', verifyToken, authorize('instructor'), instructorController.viewEnrolledStudents )

export default router
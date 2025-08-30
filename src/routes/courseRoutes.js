import express from 'express'
const router = express.Router()
import courseController from '../controllers/course/courseController.js'
import { verifyToken, authorize } from '../middlewares/authMiddleware.js'

router.get('/view-courses', verifyToken, courseController.getAllCourses)
router.get('/course-details/:courseId', verifyToken, courseController.getCourseDetails)
router.put('/toggle-publish/:courseId', verifyToken, authorize('instructor', 'admin'), courseController.togglePublishedCourse)
router.post('/search-courses', verifyToken, courseController.searchCourse)


export default router
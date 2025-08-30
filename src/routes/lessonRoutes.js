import express from 'express'

const router = express.Router()
import lessonController from '../controllers/lesson/lessonController.js'
import { verifyToken, authorize} from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multer.js'

router.post('/add-lesson/:courseId', verifyToken, authorize('instructor'), upload.single("file"), lessonController.addLesson)
router.put('/update-lesson/:lessonId', verifyToken, authorize('instructor'), upload.single("file"), lessonController.updateLesson)
router.delete('/delete-lesson/:lessonId', verifyToken, authorize('instructor'), lessonController.deleteLesson)
router.get('/get-lesson/:courseId', verifyToken, lessonController.getLessonCourse)
router.post('/mark-progress/:courseId/:lessonId', verifyToken, authorize('student'), lessonController.markLessonProgress) 




export default router
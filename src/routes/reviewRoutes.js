import express from "express"

const router = express.Router()
import reviewController from "../controllers/review/reviewController.js"
import { verifyToken, authorize } from "../middlewares/authMiddleware.js"

router.post('/add-review/:courseId', verifyToken, authorize('student'), reviewController.addReview)
router.put('/edit-review/:reviewId', verifyToken, authorize('student'), reviewController.editReview)
router.delete('/delete-review/:reviewId', verifyToken, authorize('student', 'admin'), reviewController.deleteReview)
router.get('/course-reviews/:courseId', reviewController.getCourseReviews)
router.get('/my-reviews', verifyToken, authorize('student'), reviewController.getStudentReviews)
router.get('/average/:courseId', reviewController.getAverageRating)



export default router 
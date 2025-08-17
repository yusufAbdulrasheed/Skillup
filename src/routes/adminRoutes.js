import express from 'express'
const router = express.Router()
import adminController from '../controllers/admin/adminController.js'
import { verifyToken, authorize} from '../middlewares/authMiddleware.js'


router.put('/approve-instructor/:instructorId', verifyToken, authorize('admin'), adminController.approveInstructor)
router.put('/reject-instructor/:instructorId', verifyToken, authorize('admin'), adminController.rejectInstructor)



export default router
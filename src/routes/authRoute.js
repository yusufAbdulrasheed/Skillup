import express from 'express'
const router = express.Router()
import authController from '../controllers/authController.js'
import authLimiter from '../middlewares/limiter.js'



router.post('/auth/register', authLimiter, authController.registerUser)
router.post('/auth/login', authLimiter,authController.loginUser)


export default router
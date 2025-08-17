import express from 'express'
const router = express.Router()
import authController from '../controllers/authController.js'



router.post('/auth/register', authController.registerUser)
router.post('/auth/login', authController.loginUser)


export default router
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoute from './routes/authRoute.js'
import adminRoute from './routes/adminRoutes.js'
import studentRoute from './routes/studentRoutes.js'
import instructorRoute from './routes/instructorRoutes.js'
import courseRoute from './routes/courseRoutes.js'
import lessonRoute from './routes/lessonRoutes.js'
import reviewRoute from './routes/reviewRoutes.js'
import enrollmentRoute from './routes/enrollmentRoutes.js'
import mongoose from 'mongoose'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Database Connection for Vercel
let isConnected = false

const connectToDatabase = async () =>{
    if(isConnected) return

    try{
        const MongoDB_URI =process.env.MONGODB_CONNECTION_STRING

        await mongoose.connect(MongoDB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        isConnected = true
        console.log('Connected to MongoDB')
    }

    catch(error){
        console.error('Error connecting to MongoDB:', error)
        throw error
    }
}

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, 'doc', 'swagger.yaml'))
// Middleware setup
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(cookieParser())

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase()
    next()
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed' 
    })
  }
})


// routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/v1', authRoute)
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/student', studentRoute)
app.use('/api/v1/instructor', instructorRoute)
app.use('/api/v1/course', courseRoute)
app.use('/api/v1/lesson', lessonRoute)
app.use('/api/v1/review', reviewRoute)
app.use('/api/v1/enrollment', enrollmentRoute)

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SkillUp API is running!',
    documentation: '/api-docs',
    version: '1.0.0'
  })
})

export default app
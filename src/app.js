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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, 'doc', 'swagger.yaml'))
// Middleware setup
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(cookieParser())


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

export default app
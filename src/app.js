import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoute from './routes/authRoute.js'
import adminRoute from './routes/adminRoutes.js'

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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
})

app.use(limiter)

// routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/v1', authRoute)
app.use('/api/v1/admin', adminRoute)









export default app
import 'dotenv/config'
import app from '../app.js'
import mongoose from 'mongoose'

let isConnected = false

const connectToDatabase = async () => {
  if (isConnected) return

  try {
    const MongoDB_URI = process.env.MONGODB_CONNECTION_STRING
    await mongoose.connect(MongoDB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })
    isConnected = true
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

// Connect to database and export the app
connectToDatabase()

export default app
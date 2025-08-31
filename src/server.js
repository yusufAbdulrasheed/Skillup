import 'dotenv/config'
import app from './app.js'
import mongoose from 'mongoose'

const PORT = process.env.PORT || 3000

const MongoDB_URI = process.env.MONGODB_CONNECTION_STRING

// Connect to MongoDB
mongoose.connect(MongoDB_URI)
.then(() =>{
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
})
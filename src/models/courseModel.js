import mongoose from "mongoose"
import { type } from "os"

const  courseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    thumbnail: {type: String},
    instructor:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    lessons: [{type: mongoose.Schema.Types.ObjectId, ref: "Lesson"}],
    price: {type: Number, default: 0},
    isPublished:{type: Boolean, default: false}
},
    { timestamps: true }

)

export default mongoose.model("Course", courseSchema)
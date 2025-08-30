import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["student","instructor", "admin"],
        default: "student"
    },

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    isBlocked:{ type: Boolean, default: false},

    avatar:{
        type: String,
        default: "https://res.cloudinary.com/dz1qj3x8h/image/upload/v1709301234/avatar/avatar.png"
    },

    bio:{
        type: String 
    }, 
},
    { timestamps: true }
)


export default mongoose.model("User", userSchema)

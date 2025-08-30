import User from '../models/usersModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const registerUser = async (req, res) => {
    try{
        const { name, email, password, role } = req.body

        const existingUser = await User.findOne({ email})
        if(existingUser){
            return res.status(401).json({
                success: false,
                msg: 'User already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

         let status = "pending";
        if (role === "admin" || role === undefined) {
            status = "approved";
        }

        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
            role,
            status
        })

        return res.status(201).json({
            success: true,
            msg: 'User registered successfully',
        })
    }
    catch(err){
        console.error(err.message, err.stack);
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    const token = jwt.sign(
      {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,        
          status: user.status
        }
      },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    )

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}
const logoutUser = async(req, res) =>{
    try{


    }

    catch(err){
        return res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
}


export default {
    registerUser,
    loginUser,
    logoutUser
}

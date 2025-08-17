import User from '../models/usersModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


// Register a new user
const registerUser = async (req, res) => {
    try{
        const { name, email, password, role } = req.body

        // chech if user already exists
        const existingUser = await User.findOne({ email})
        if(existingUser){
            return res.status(401).json({
                success: false,
                msg: 'User already exists'
            })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

         let status = "pending";
        if (role === "admin") {
            status = "approved";
        }

        // create a new user
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
            // token
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

// Login a user
// Your login controller should look like this:
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    // Verify password (assuming you have password comparison logic)
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    // 🚨 FIX: Create token with proper user data
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,        // 🚨 CRITICAL: Include the role!
          status: user.status
        }
      },
      process.env.JWT_SECRET, // Make sure this matches your middleware
      { expiresIn: '1h' }
    )

    // Return success response
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

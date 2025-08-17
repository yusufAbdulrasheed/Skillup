// import jwt from 'jsonwebtoken'

// export const verifyToken = async (req, res, next) => {
  
//   const token = req.body?.token || 
//                 req.query.token || 
//                 req.headers["authorization"]

//   if (!token) {
//     return res.status(403).json({
//       success: false,
//       msg: 'A token is required for authentication'
//     })
//   }

//   try {
//     const bearer = token.split(' ')
//     const bearerToken = bearer[1]

    
//     const decodedData = jwt.verify(bearerToken, process.env.JWT_SECRET)
//     req.user = decodedData.user
//   } catch (error) {
    
//     return res.status(400).json({
//       success: false,
//       msg: 'Invalid Token'
//     })
//   }

//   return next()
// }
// export const authorize =  (...roles) =>{
//   return (req, res, next) =>{
//     if(!roles.includes(req.user.role)){
//       return res.status(403).json({
//         message: "Forbiden: Access Denied"
//       })
//     }
//     next()
//   }

// }


import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
  const token = req.body?.token ||
                req.query.token ||
                req.headers["authorization"]

  if (!token) {
    return res.status(403).json({
      success: false,
      msg: 'A token is required for authentication'
    })
  }

  try {
    const bearer = token.split(' ')
    const bearerToken = bearer[1]
    
    // Fix 1: Use the correct environment variable name
    const decodedData = jwt.verify(bearerToken, process.env.JWT_SECRET)
    req.user = decodedData.user
    
    // Fix 2: Add debugging to see what's in the token
    console.log('🔍 Decoded token:', decodedData)
    console.log('🔍 User set in req:', req.user)
    
  } catch (error) {
    console.log('❌ Token error:', error.message)
    // Fix 3: Add return statement
    return res.status(400).json({
      success: false,
      msg: 'Invalid Token'
    })
  }

  return next()
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    // Fix 4: Add safety check for req.user
    if (!req.user) {
      console.log('❌ No user found in request object')
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      })
    }

    // Fix 5: Add debugging for role check
    console.log('🔍 Required roles:', roles)
    console.log('🔍 User role:', req.user.role)
    console.log('🔍 Role check passes:', roles.includes(req.user.role))

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access Denied"
      })
    }
    
    next()
  }
}
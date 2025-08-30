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
    
    const decodedData = jwt.verify(bearerToken, process.env.JWT_SECRET)
    req.user = decodedData.user
    
  } catch (error) {
    console.log('❌ Token error:', error.message)
    return res.status(400).json({
      success: false,
      msg: 'Invalid Token'
    })
  }

  return next()
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access Denied"
      })
    }
    
    next()
  }
}
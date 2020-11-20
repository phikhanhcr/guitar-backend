const jwt = require('jsonwebtoken')
module.exports.checkAuthToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(201).json('Access denied. No token provided');
  }
    try {
    const decoded = jwt.verify(token, process.env.JWTKey);  
    req.user = decoded;
    next()

  } catch (error) {
    return res.status(201).json({
      invalidToken : "Invalid Token"
    })
  }
}
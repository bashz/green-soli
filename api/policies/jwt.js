const jwt = require('jsonwebtoken')

module.exports = (req, res, proceed) => {
  const token = req.headers.authorization
  if (!token) {
    return proceed()
  }
  try {
    const decoded = jwt.verify(token.replace(/^Bearer /, ''), sails.config.jwt.secret)
    req.user = decoded
  } catch (e) {
    return res.unauthorized(new Error('The token provided is corrupt'))
  }
  return proceed()
}
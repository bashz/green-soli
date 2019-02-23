module.exports = async (req, res, proceed) => {
  const token = req.headers.authorization
  if (!token) {
    return proceed()
  }
  try {
    const decoded = jwt.verify(token.replace(/^Bearer /, ''), sails.config.session.secret)
    req.userId = decoded.id
  } catch (e) {
    return res.unauthorized(new Error('The token provided is corrupt'))
  }
  return proceed()
}
module.exports = (req, res, proceed) => {
  const token = req.headers['x-mobile-app']
  if (!token || token !== sails.config.mobile.secret) {
    return res.unauthorized(new Error('This endpoint require the mobile app'))
  }
  return proceed()
}

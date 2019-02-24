module.exports = async (req, res, proceed) => {
  if (req.user) {
    return proceed()
  }
  return res.unauthorized(new Error('Could not determine the actual user!'))
}

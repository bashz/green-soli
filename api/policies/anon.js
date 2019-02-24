module.exports = (req, res, proceed) => {
  const token = req.headers.authorization
  if (!token) {
    return proceed()
  }
  return res.conflict(new Error('User already logged, or his device think so!'))
}

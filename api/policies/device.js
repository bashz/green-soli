module.exports = async (req, res, proceed) => {
  const deviceId = req.headers['x-device-id']
  if (!deviceId) {
    return res.unauthorized(new Error('No user was provided'))
  }
  const user = await User.findOne({currentDeviceId: deviceId})
  if (!user) {
    return res.unauthorized(new Error('Provided user was not found'))
  }
  req.userId = user.id
  return proceed()
}

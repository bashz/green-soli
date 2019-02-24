module.exports = async (req, res, proceed) => {
  if (req.user) {
    return proceed()
  }
  const deviceId = req.headers['x-device-id']
  if (!deviceId) {
    return res.unauthorized(new Error('No user was provided'))
  }
  let user = await User.findOne({deviceId})
  if (!user) {
    user = await User.create({deviceId}).fetch()
  }
  req.user = _.omit(user, ['password', 'salt'])
  return proceed()
}

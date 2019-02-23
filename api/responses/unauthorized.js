module.exports = function unauthorized (data) {
  const res = this.res
  const status = 401

  if (_.isUndefined(data)) {
    sails.log.debug('Empty unauthorized response sent')
    return res.sendStatus(status)
  }

  res.status(status)
  if (_.isError(data)) {
    sails.log.debug('Unauthorized response response called, with an error', data)
    if (!_.isFunction(data.toJSON)) {
      sails.log.debug('Not Fully handled Error')
      let details = {error: data.code || true, message: data.message}
      if (process.env.NODE_ENV !== 'production') {
        details.stack = data.stack
      }
      return res.json(details)
    }
  }
  return res.json(data)
}

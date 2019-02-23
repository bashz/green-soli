module.exports = function notFound (data) {
  const res = this.res
  const status = 404

  if (_.isUndefined(data)) {
    sails.log.debug('Empty notFound response sent')
    return res.sendStatus(status)
  }

  res.status(status)
  if (_.isError(data)) {
    sails.log.debug('NotFound response called, with an error', data)
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

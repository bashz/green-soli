module.exports = function created (data) {
  const res = this.res
  let status = 201

  if (_.isUndefined(data)) {
    sails.log.debug('Empty created response sent')
    return res.sendStatus(status)
  }

  if (_.isError(data)) {
    sails.log.debug('Created response called, with an error', data)
    sails.log.debug('Mutating Created response to serverError response')
    status = 500
    if (!_.isFunction(data.toJSON)) {
      sails.log.debug('Not Fully handled Error')
      let details = {error: data.code || true, message: data.message}
      if (process.env.NODE_ENV !== 'production') {
        details.stack = data.stack
      }
      res.status(status)
      return res.json(details)
    }
  }
  res.status(status)
  return res.json(data)
}

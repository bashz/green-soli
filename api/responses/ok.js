module.exports = function resOk (data) {
  const req = this.req
  const res = this.res
  let status = 200
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // If `res.ok()` is being called by the blueprint "create" action,
  // then use 201 instead.
  var isBlueprintAction = !!req.options.model
  if (isBlueprintAction) {
    var bpActionName = _.last(req.options.action.split('/'))
    if (bpActionName === 'create') {
      sails.log.debug('Mutating OK response to Created response')
      status = 201
    }
  }
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  if (_.isUndefined(data)) {
    sails.log.debug('Empty OK response sent')
    return res.sendStatus(status)
  }

  if (_.isError(data)) {
    sails.log.debug('OK response called, with an error', data)
    sails.log.debug('Mutating OK response to serverError response')
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

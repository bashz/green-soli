module.exports = function noContent () {
  sails.log.debug('NoContent response sent')
  return this.res.sendStatus(204)
}

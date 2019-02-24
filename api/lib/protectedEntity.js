const crypto = require('crypto')

module.exports = {
  /**
   * Hash an entity password.
   *
   * @param {Object}   password
   * @param {Function} next
   */
  hash (entity, next) {
    entity.password = crypto.createHmac('sha512', entity.salt).update(entity.password).digest('hex')
    next(null, entity)
  },
  /**
   * Callback to be run before creating an entity.
   *
   * @param {Object}   entity The soon-to-be-created entity
   * @param {Function} next
   */
  create(entity, next) {
    entity.salt = crypto.createHash('md5').update(crypto.randomBytes(8).join('')).digest('hex')
    this.hash(entity, next)
  },
  /**
   * Validate password.
   *
   * @param {string}   password The password to validate
   */
  validate(entity, password) {
    return entity.password === crypto.createHmac('sha512', entity.salt).update(password).digest('hex')
  },
  /**
   * Generate gravatr url
   *
   * @param {string} email
   */
  getGravatarUrl (email) {
    return `https://gravatar.com/avatar/${crypto.createHash('md5').update(email).digest('hex')}`
  }
}

const passport = require('passport')
const jwt = require('jsonwebtoken')

module.exports = {
  friendlyName: 'Login',
  description: 'Authorize the user and attempt to link his account if needed.',
  inputs: {
    username: {
      type: 'string',
      description: 'username.',
      required: true
    },
    password: {
      type: 'string',
      description: 'password.',
      required: true
    }
  },
  exits: {
    serverError: {
      responseType: 'serverError'
    },
    notFound: {
      responseType: 'notFound'
    },
    success: {
      responseType: 'ok'
    }
  },
  async fn (inputs, exits) {
    passport.authenticate('local', async (err, user) => {
      if (err) { return exits.serverError(err) }
      if (!user) { return exits.notFound() }
      console.log(sails.config)
      const token = jwt.sign(user, sails.config.jwt.secret)
      await sails.helpers.linkAccount(user)
      return exits.success({user, token})
    })(this.req, this.res)
  }
}

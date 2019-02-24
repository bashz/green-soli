module.exports = {
  friendlyName: 'Signup',
  description: 'Transform anonymous user to an account user.',
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
    },
    email: {
      type: 'string',
      description: 'email.',
      required: false
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
  fn: async function (inputs, exits) {
    let user = null
    try {
      user = await User.updateOne({id: this.req.user.id})
        .set({
          username: inputs.username,
          password: inputs.password,
          email: inputs.email
        })
    } catch (e) {
      return exits.serverError(e)
    }
    if (!user) {
      return exits.notFound()
    }
    return exits.success(user)
  }
}

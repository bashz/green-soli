module.exports = {
  friendlyName: 'Me',
  description: 'Self identifier.',
  inputs: {
  },
  exits: {
    success: {
      responseType: 'ok'
    }
  },
  fn: async function (inputs, exits) {
    return exits.success(this.req.user)
  }
}

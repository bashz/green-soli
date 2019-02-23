module.exports = {
  friendlyName: 'Version',
  description: 'Version app.',
  inputs: {
  },
  exits: {
  },
  fn: async function (inputs, exits) {
    return exits.success({version: '0.0.1'})
  }
}

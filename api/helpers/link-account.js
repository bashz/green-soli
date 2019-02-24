module.exports = {
  friendlyName: 'Link account',
  description: 'Link owner foreign object to his account.',
  inputs: {
    user: {
      type: {},
      description: 'user id.',
      required: true
    }
  },
  exits: {
    success: {
      description: 'Account linked.',
    },
    error: {
      outputFriendlyName: 'Error linking account',
      outputDescription: 'Something wrong happened while trying to link an account.'
    }
  },
  fn: async function (inputs, exits) {
    try {
      const pollutions = await Pollution.update({deviceId: inputs.user.deviceId}).set({user: inputs.user.id})
      return exits.success(pollutions)
    } catch (e) {
      return exits.error(e)
    }
  }
}

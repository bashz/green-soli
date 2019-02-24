/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const protected = require('../lib/protectedEntity')

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    username: {
      type: 'string'
    },
    deviceId: {
      type: 'string'
    },
    email: {
      type: 'string',
      // unique: true,
      isEmail: true
    },
    pic: {
      type: 'string',
      isURL: true
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 128
    },
    salt: {
      type: 'string'
    },
    plaintedTrees: {
      type: 'number',
      defaultsTo: 0
    },
    dueTrees: {
      type: 'number',
      defaultsTo: 0
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    pollutions: {
      collection: 'Pollution',
      via: 'user'
    }
  },
  beforeCreate (user, next) {
    protected.create(user, next)
  },
  beforeUpdate (valuesToSet, next) {
    if (valuesToSet.password) {
      protected.create(valuesToSet, next)
    } else {
      return next()
    }
  },
  customToJSON () {
    if (this.email && !this.pic) {
      this.pic = protected.getGravatarUrl(this.email)
    }
    return _.omit(this, ['password', 'salt'])
  },
  validatePassword: protected.validate
}

/**
 * populate hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function populateHook(sails) {
  return {
    initialize: async function() {
      const eventsToWaitFor = ['hook:orm:loaded']
      sails.after(eventsToWaitFor, async () => {
        if (sails.config.models.migrate !== 'safe' && sails.environment !== 'production') {
          let types = []
          let users = []
          types.push(Type.findOrCreate(
            { 
              name: 'trip_car'
            },
            {
              name: 'trip_car',
              rate: 12,
              co2Rate: 2,
              eligibleDetails: {
                from: 'string',
                to: 'string',
                locmotive: 'enum'
              }
            }
          ))
          users.push(User.findOrCreate(
            {
              deviceId: '00001'
            },
            {
              username: 'Jhon Doe',
              deviceId: '00001'
            }
          ))
          try {
            done = await Promise.all(types.concat(users))
            return done
          } catch (e) {
            sails.log.error(e)
          }
        }
        return
      })
    }
  }
}

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const auth = (username, password) => {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ username }).catch(reject)
    if (!user) {
      return reject(new Error('bad credential'))
    }
    if (!User.validatePassword(user, password)) {
      return reject(new Error('bad credential'))
    }
    return resolve(user)
  })
}

passport.serializeUser((user, done) => {
  done(null, _.omit(user, ['password', 'salt']))
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  const user = await auth(username, password).catch(done)
  return done(null, user)
}))

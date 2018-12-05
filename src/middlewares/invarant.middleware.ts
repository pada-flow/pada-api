import * as passport from 'passport'

export function invarant(req, res, next) {
  passport.authenticate('azuread-openidconnect', {
    failureRedirect: '/',
  })
  next()
}

import { OIDCStrategy } from 'passport-azure-ad'
import { credsConf } from '../config/creds'
import * as passport from 'passport'

export default function () {
  const users = []

  const findByOid = function(oid, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
    console.info('-----> we are using user: ', user);
      if (user.oid === oid) {
        return fn(null, user);
      }
    }
    return fn(null, null);
  };

  passport.use(new OIDCStrategy(
    {
      ...credsConf,
      identityMetadata: process.env.MS_CREDS_IDENTITY_METADATA,
      clientID: process.env.MS_CREDS_CLIENT_ID,
      clientSecret: process.env.MS_CREDS_CLIENT_SECRET,
    },
    (iss, sub, profile, accessToken, refreshToken, done) => {
      if (!profile.oid) {
        return done(new Error("No oid found"), null);
      }
      console.log('profile.oid---', profile.oid)
      done()
      // asynchronous verification, for effect...
      process.nextTick(function () {
        findByOid(profile.oid, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            // "Auto-registration"
            users.push(profile);
            return done(null, profile);
          }
          return done(null, user);
        });
      });
    }
  ));
}
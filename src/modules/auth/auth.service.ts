import { Injectable } from '@nestjs/common'
import { OIDCStrategy } from 'passport-azure-ad'
import { credsConf } from '../../config/creds'
import * as passport from 'passport'
import { AuthenticationContext } from 'adal-node'

@Injectable()
export class AuthService {
  private users: any[] = []

  constructor() {
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
        process.nextTick(() => {
          this.findByOid(profile.oid, (err, user) => {
            if (err) {
              return done(err);
            }
            if (!user) {
              // "Auto-registration"
              this.users.push(profile);
              return done(null, profile);
            }
            return done(null, user);
          })
        })
      }
    ))
  }

  private findByOid (oid, fn) {
    for (var i = 0, len = this.users.length; i < len; i++) {
      var user = this.users[i];
    console.info('-----> we are using user: ', user);
      if (user.oid === oid) {
        return fn(null, user);
      }
    }
    return fn(null, null);
  };

  async ticket(): Promise<string> {
    return ' this is your ticket';
  }

  async login (): Promise<any> {
    const result = await passport.authenticate('azuread-openidconnect', 
      { 
        failureRedirect: '/' 
      }
    )()
    console.log('result---', result)
    return result
  }
}

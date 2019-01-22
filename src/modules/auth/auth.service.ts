import { Injectable } from '@nestjs/common'
import { OIDCStrategy } from 'passport-azure-ad'
import { credsConf } from '../../config/creds'
import * as passport from 'passport'
import { AuthenticationContext } from 'adal-node'
import * as crypto from 'crypto'

const sampleParameters = {
  tenant : process.env.MS_CREDS_TELNANT,
  authorityHostUrl : 'https://login.windows.net',
  clientId : process.env.MS_CREDS_CLIENT_ID,
  username : '',
  password : '',
}
// const authorityHostUrl = 'https://login.windows.net'
// const authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant
const redirectUri = 'http://localhost:31544/auth/openid/return'
const resource = '00000002-0000-0000-c000-000000000000'
const templateAuthzUrl = 'https://login.windows.net/' + sampleParameters.tenant + '/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>'

@Injectable()
export class AuthService {
  private users: any[] = []

  constructor() {

  }

  private getTicket(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(48, (err, buf) => {
        if (err) { throw new Error('err') }
        resolve(
          buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
        )
      })
    })
  }

  private createAuthorityUrl(): string {
    return sampleParameters.authorityHostUrl + '/' + process.env.MS_CREDS_TELNANT
  }

  private createAuthorizationUrl(state): string {
    const templateAuthzUrl = 'https://login.windows.net/' + process.env.MS_CREDS_TELNANT + '/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>'
    return templateAuthzUrl.replace('<client_id>', process.env.MS_CREDS_CLIENT_ID)
      .replace('<redirect_uri>', redirectUri)
      .replace('<state>', state)
      .replace('<resource>', resource)
  }

  private authProcess(req): Promise<string> {
    const authenticationContext = new AuthenticationContext(
      this.createAuthorityUrl(),
    )
    return new Promise((resolve, reject) => {
      authenticationContext.acquireTokenWithAuthorizationCode(
        req.query.code, redirectUri, resource, process.env.MS_CREDS_CLIENT_ID, process.env.MS_CREDS_CLIENT_SECRET,
        (err, response: any) => {
          let message = ''
          if (err) {
            message = 'error: ' + err.message + '\n'
          }
          message += 'response: ' + JSON.stringify(response)

          if (err) {
            resolve(message)
          }

          // Later, if the access token is expired it can be refreshed.
          authenticationContext.acquireTokenWithRefreshToken(
            response.refreshToken, sampleParameters.clientId, process.env.MS_CREDS_CLIENT_SECRET, resource,
            (refreshErr, refreshResponse) => {
              if (refreshErr) {
                message += 'refreshError: ' + refreshErr.message + '\n'
              }
              message += 'refreshResponse: ' + JSON.stringify(refreshResponse)

              resolve(message)
            },
          )
        },
      )
    })
  }

  async ticket(): Promise<string> {
    const ticket = await this.getTicket()
    return ticket
  }

  async login(token, res): Promise<any> {
    res.cookie('authstate', token)
    const authorizationUrl = this.createAuthorizationUrl(token)
    res.redirect(authorizationUrl)
  }

  async openIdReturn(req): Promise<any> {
    if (req.cookies.authstate !== req.query.state) {
      return 'error: state does not match'
    }
    const result = await this.authProcess(req)
    console.log('result---', result)
    return result
  }
}
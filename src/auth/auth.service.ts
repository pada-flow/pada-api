import { Injectable } from '@nestjs/common'
import { OIDCStrategy } from 'passport-azure-ad'
// import { credsConf } from '../../config/creds'
import * as passport from 'passport'
import { AuthenticationContext } from 'adal-node'
import * as crypto from 'crypto'
import * as os from 'os'

import store from './authStore'

const sampleParameters = {
  tenant : process.env.MS_CREDS_TELNANT,
  authorityHostUrl : 'https://login.windows.net',
  clientId : process.env.MS_CREDS_CLIENT_ID,
  username : '',
  password : '',
}
// const authorityHostUrl = 'https://login.windows.net'
// const authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant
const redirectUri = 'http://localhost:31544/api/auth/openid/return'
const resource = '00000002-0000-0000-c000-000000000000'

@Injectable()
export class AuthService {
  private users: any[] = []
  private templateAuthzUrl = ''
  constructor() {
    this.templateAuthzUrl = 'https://login.windows.net/' + process.env.MS_CREDS_TELNANT + '/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>'
  }

  private getTicket(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(48, (err, buf) => {
        if (err) { throw new Error('err') }
        const ticket = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
        store.set(ticket, null)
        resolve(ticket)
      })
    })
  }

  private createAuthorityUrl(): string {
    return sampleParameters.authorityHostUrl + '/' + process.env.MS_CREDS_TELNANT
  }

  private createAuthorizationUrl(state): string {
    return this.templateAuthzUrl.replace('<client_id>', process.env.MS_CREDS_CLIENT_ID)
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
            throw new Error(err.message)
          }
          console.log('response---', response)
          resolve(response)
          // message += 'response: ' + JSON.stringify(response)

          // if (err) {
          //   resolve(message)
          // }

          // // Later, if the access token is expired it can be refreshed.
          // authenticationContext.acquireTokenWithRefreshToken(
          //   response.refreshToken, sampleParameters.clientId, process.env.MS_CREDS_CLIENT_SECRET, resource,
          //   (refreshErr, refreshResponse) => {
          //     if (refreshErr) {
          //       throw new Error('refreshError: ' + refreshErr.message)
          //     }
          //     message += 'refreshResponse: ' + JSON.stringify(refreshResponse)

          //     resolve(message)
          //   },
          // )
        },
      )
    })
  }

  async ticket(userTicket: string): Promise<string> {
    const accessToken = store.get(userTicket)
    if (!accessToken) {
      return await this.getTicket()
    }
    return userTicket
  }

  async login(token, res): Promise<any> {
    res.cookie('authstate', token)
    const authorizationUrl = this.createAuthorizationUrl(token)
    res.redirect(authorizationUrl)
  }

  async openIdReturn(req, ticket): Promise<any> {
    if (!ticket) {
      return 'where is your ticket??'
    }
    if (req.cookies.authstate !== req.query.state) {
      return 'error: state does not match'
    }
    const result = await this.authProcess(req)
    store.set(ticket, result)
    return result
  }

  async status(ticket: string): Promise<boolean> {
    const accessToken = store.get(ticket)
    return accessToken || null
  }
}
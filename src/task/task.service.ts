import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { stringify } from 'qs'
import { PadaLogger } from '../deps/logger'

import store from '../auth/authStore'
import { type } from 'os'

@Injectable()
export class TaskService {
  constructor(
    private readonly logger: PadaLogger
  ) {}

  private appendAccessToken(ticket) {
    const accessToken = store.get(ticket)
    console.log('sccessToken---', accessToken, typeof accessToken)
    if (!accessToken) {
      throw new Error('You have invalid ticket')
    }
    return {
      headers: {
        ['Content-Type']: 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken.accessToken}`
      }
    }
  }
  
  public async list(ticket: string) {
    this.logger.info(`ticket receive=${ticket}`)
    const oauth = this.appendAccessToken(ticket)
    let result: any
    this.logger.info(`query task list from ms api`)
    // try {
      result = await axios.post('https://outlook.office.com/api/v2.0/me/tasks', {}, oauth)
    // } catch (e) {
      // console.log('e---', e)
      // console.log('------', e.response.data)
    // }
    return result
  }
}

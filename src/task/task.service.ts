import { Injectable, HttpException } from '@nestjs/common'
import axios from 'axios'
import { stringify } from 'qs'
import { PadaLogger, HttpService } from '../common'

import store from '../auth/authStore'
import { type } from 'os'

@Injectable()
export class TaskService {
  constructor(
    private readonly logger: PadaLogger,
    private readonly httpService: HttpService
  ) {}

  private appendAccessToken(ticket) {
    const accessToken = store.get(ticket)
    console.log('sccessToken---', accessToken, typeof accessToken)
    if (!accessToken) {
      throw new HttpException('You have invalid ticket', 400)
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
    result = await this.httpService.post('https://outlook.office.com/api/v2.0/me/tasks', {}, oauth)
    return result
  }
}

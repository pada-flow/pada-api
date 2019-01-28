import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { PadaLogger } from '../deps/logger'

import store from '../auth/authStore'

@Injectable()
export class TaskService {
  constructor(
    private readonly logger: PadaLogger
  ) {}
  
  public async list(ticket: string) {
    this.logger.info(`ticket receive=${ticket}`)
    const result = await axios.get('https://outlook.office.com/api/v2.0/me/tasks')
    return result
  }
}

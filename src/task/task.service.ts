import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class TaskService {
  constructor() {}
  
  public async list() {
    const result = await axios.get('https://outlook.office.com/api/v2.0/me/tasks', {
      headers: {
        Cookie: "cookie1=value; cookie2=value; cookie3=value;"
      }
    })
    return result
  }
}

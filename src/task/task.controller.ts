import { Controller, Get, Headers } from '@nestjs/common'
import { TaskService } from './task.service'

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService
  ){}

   @Get('list')
   async task(@Headers() header): Promise<any> {
    const ticket = header['pada-ticket']
    return await this.taskService.list(ticket)
  }
}
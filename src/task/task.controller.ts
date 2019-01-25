import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService
  ){}

   @Get('list')
   async task(): Promise<any> {
    return await this.taskService.list()
  }
}
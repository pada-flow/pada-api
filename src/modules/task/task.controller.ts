import { Controller, Get } from '@nestjs/common';

@Controller('task')
export class TaskController {
  constructor(){}

   @Get()
   async task(): Promise<string> {
    return 'task'
  }
}
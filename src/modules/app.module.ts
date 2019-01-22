import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { AuthMiddleware } from '../middlewares/auth.middleware'

import { TaskController } from './task/task.controller'

@Module({
  imports: [],
  controllers: [AuthController, TaskController],
  providers: [AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}

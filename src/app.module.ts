import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'

import { AuthController } from './modules/auth/auth.controller'
import { AuthService } from './modules/auth/auth.service'
import { EventsModule } from './modules/events/events.module'

import { TaskController } from './modules/task/task.controller'
import { InvarantMiddleware } from './middlewares/invarant.middleware'
import { DepModule } from './deps'
// import { Logger } from './deps/logger'

@Module({
  imports: [EventsModule, DepModule],
  controllers: [AuthController, TaskController],
  providers: [AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InvarantMiddleware)
      .forRoutes('*')
  }
}

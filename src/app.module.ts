import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'

import { AuthModule } from './auth'

import { EventsModule } from './modules/events/events.module'

import { TaskController } from './modules/task/task.controller'
import { InvarantMiddleware } from './middlewares/invarant.middleware'
import { DepModule } from './deps'
// import { Logger } from './deps/logger'

@Module({
  imports: [EventsModule, DepModule, AuthModule],
  controllers: [TaskController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InvarantMiddleware)
      .forRoutes('*')
  }
}

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'

import { AuthModule } from './auth'
import { TaskModule } from './task'

import { EventsModule } from './modules/events/events.module'

import { InvarantMiddleware } from './middlewares/invarant.middleware'
import { DepModule } from './deps'
// import { Logger } from './deps/logger'

@Module({
  imports: [EventsModule, DepModule, AuthModule, TaskModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InvarantMiddleware)
      .forRoutes('*')
  }
}

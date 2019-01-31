import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common'

import { Logger } from './logger'
import { ContextMiddleware, ContextModule } from './context'
import { InvarantMiddleware } from '../middlewares/invarant.middleware'
import { HttpExceptionFilter, AnyExceptionFilter, InternalErrorFilter } from './exception'
import { HttpModule } from './http'

const depComponents = [
  ContextModule,
  Logger,
  HttpExceptionFilter,
  // AnyExceptionFilter,
  InternalErrorFilter,
  HttpModule
]

@Global()
@Module({
  imports: depComponents,
  exports: depComponents
})
export class DepModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ContextMiddleware).forRoutes('*')
    consumer.apply(InvarantMiddleware).forRoutes('*')
  }
}
import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common';
import { Logger } from './logger'
import { ContextMiddleware, ContextModule } from './context'
import { InvarantMiddleware } from '../middlewares/invarant.middleware'

const depComponents = [
  ContextModule,
  Logger,
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
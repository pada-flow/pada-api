import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common';
import { Logger } from './logger';

const depComponents = [
  Logger
]

@Global()
@Module({
  providers: depComponents,
  exports: depComponents
})
export class DepModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    // consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
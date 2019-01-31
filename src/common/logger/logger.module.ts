import { Module, Global, DynamicModule } from '@nestjs/common'
import { PadaLogger } from './logger.controller'

@Module({
  providers: [ PadaLogger ],
  exports: [ PadaLogger ]
})
export class Logger {}
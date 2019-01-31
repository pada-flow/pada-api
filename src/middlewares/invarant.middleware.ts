import { Injectable, NestMiddleware, MiddlewareFunction, Logger } from '@nestjs/common'
import { PadaLogger } from '../common'

@Injectable()
export class InvarantMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: PadaLogger
  ) {}
  
  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      this.logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`)
      // console.log('console.logll====', res, req)
      next()
    }
  }
}
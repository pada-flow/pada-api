import { NestMiddleware, MiddlewareFunction, Injectable } from '@nestjs/common'
import * as uuid from 'uuid'

import { ContextService } from './context.service'

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private readonly ctx: ContextService
  ) {
  }
  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      req.id = uuid()
      this.ctx.create(() => {
        this.ctx.traceId = req.id
        next()
      })
    };
  }
}
import { Middleware, NestMiddleware, MiddlewareFunction } from '@nestjs/common'

@Middleware()
export class AuthMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      console.log('----- im checking auth')
      next()
    }
  }
}
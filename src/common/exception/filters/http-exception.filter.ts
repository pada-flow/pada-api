import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { HttpException } from '@nestjs/common'

import { PadaLogger } from '../../logger'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: PadaLogger
  ) {
  }
  
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status = exception.getStatus()
    const message = exception.getResponse()

    this.logger.error(message)
    response
      .status(status)
      .json({
        message,
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
      })
  }
}
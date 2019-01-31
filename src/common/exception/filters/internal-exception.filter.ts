import {
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common'

import { PadaLogger } from '../../logger'

@Catch(InternalServerErrorException)
export class InternalErrorFilter implements ExceptionFilter {
  constructor(
    private readonly logger: PadaLogger
  ) {}

  public catch(exception: InternalServerErrorException, response) {
    const statusCode = exception.getStatus()
    const { error, message } = exception.getResponse() as any

    this.logger.error(error.message)
    
    response.status(statusCode).json({
      message,
      statusCode,
    })
  }
}

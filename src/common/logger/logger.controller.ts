import { Logger, Injectable } from '@nestjs/common'
import * as clfDate from 'clf-date'
import { Logger as WinstonLogger, createLogger, format, transports } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { ContextService } from '../context'

// import clfDate from 'clf-date';

// import { Context } from '../context';
// import { Env } from '../env';
const { combine, timestamp, label, printf, prettyPrint } = format

// export default logger
@Injectable()
export class PadaLogger extends Logger {
  private winston: WinstonLogger

  constructor(
    private ctx: ContextService
  ) {
    super()
    // const traceId = this.ctx.traceId
    this.winston = createLogger({
      format: combine(
        format.colorize({ all: true }),
        label({ label: 'PADA' }),
        timestamp(),
        prettyPrint(),
        printf((info) => {
          return `[${info.label}] ${process.pid}  - ${clfDate()}  ${info.level}: ${info.message} traceId=${info.traceId}`
        }),
      ),
      transports: [
        new transports.Console(),
        new DailyRotateFile({
          filename: `${process.env.LOG_PATH}/application-%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d'
        })
      ]
    })
  }

  error(message: string | object, trace?: string, context?: string) {
    this.winston.error({
      level: 'error',
      message,
      traceId: this.ctx.traceId
    })
  }

  log(message: string) {
    this.winston.log({
      level: 'warn',
      message,
      traceId: this.ctx.traceId
    })
  }

  warn(message: string | object) {
    this.winston.warn({
      level: 'warn',
      message,
      traceId: this.ctx.traceId
    })
  }

  info(message: string | object) {
    this.winston.info({
      level: 'info',
      message,
      traceId: this.ctx.traceId
    })
  }

}
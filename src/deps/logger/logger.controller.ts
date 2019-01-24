import { Logger, Injectable } from '@nestjs/common'
import * as clfDate from 'clf-date'
import { Logger as WinstonLogger, createLogger, format, transports } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'

// import clfDate from 'clf-date';

// import { Context } from '../context';
// import { Env } from '../env';
const { combine, timestamp, label, printf, prettyPrint } = format

const myFormat = printf((info) => {
  return `[${info.label}] ${process.pid}  - ${clfDate()}  ${info.level}: ${info.message}`
})

// export default logger
@Injectable()
export class PadaLogger extends Logger {
  private winston: WinstonLogger

  constructor() {
    super()
    this.winston = createLogger({
      format: combine(
        format.colorize({ all: true }),
        label({ label: 'PADA' }),
        timestamp(),
        myFormat,
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

  error(message: string, trace?: string, context?: string) {
    this.winston.log({
      level: 'error',
      message
    })
  }

  log(message: string) {
    this.winston.log({
      level: 'warn',
      message,
    })
  }

  warn(message: string) {
    this.winston.log({level: 'warn', message})
  }

  info(message: string) {
    this.winston.log({
      level: 'info',
      message
    })
  }

}
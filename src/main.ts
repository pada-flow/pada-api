import { NestFactory } from '@nestjs/core'
import { WsAdapter } from '@nestjs/websockets/adapters'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import * as passport from 'passport'
import * as cookieParser from 'cookie-parser'

import { HttpExceptionFilter, AnyExceptionFilter } from './deps'

async function bootstrap() {
console.log('boot---', process.env.LOG_PATH)
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(cookieParser())

  // ws
  app.useWebSocketAdapter(new WsAdapter(app.getHttpServer()))

  // filter
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalFilters(new AnyExceptionFilter())
  // validation pipe
  // app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT)
  console.log(`app listening on port ${process.env.PORT}`)
}
config()
bootstrap()

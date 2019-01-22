import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { config } from 'dotenv'
import * as passport from 'passport'
import * as cookieParser from 'cookie-parser'

import { invarant } from './middlewares/invarant.middleware'

async function bootstrap() {
  config()
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  // app.use(invarant)
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(cookieParser())
  await app.listen(process.env.PORT)
  console.log(`app listening on port ${process.env.PORT}`)
}

bootstrap()

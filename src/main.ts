import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { config } from 'dotenv'
import * as passport from 'passport'

import { invarant } from './middlewares/invarant.middleware'

async function bootstrap() {
  config()
  const app = await NestFactory.create(AppModule)
  app.use(invarant)
  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(3002)
}

bootstrap()

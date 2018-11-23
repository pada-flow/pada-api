import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { config } from 'dotenv'
import useMSCred from './middleware/useMSCred'

async function bootstrap() {
  const creds = config()
  await useMSCred()
  const app = await NestFactory.create(AppModule);
  await app.listen(3002);
}

bootstrap()

import * as dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../../../.env') });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  });
  await app.listen(process.env.BACKEND_PORT ?? 3001);
}
bootstrap();

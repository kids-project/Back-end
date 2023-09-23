import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: 'https://hanghackerton-lookids.vercel.app',
  });

  await app.listen(3000);
}
bootstrap();

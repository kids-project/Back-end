import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: 'http://lookids.bucket.s3-website.kr.object.ncloudstorage.com',
  });

  await app.listen(3000);
}
bootstrap();

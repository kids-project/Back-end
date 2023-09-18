import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from './db/db.module';
import { ContextModule } from './context/context.module';

@Module({
  imports: [DBModule, ContextModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

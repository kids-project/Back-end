import { Module } from '@nestjs/common';
import { FairyService } from './fairy.service';
import { FairyController } from './fairy.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [FairyController],
  providers: [FairyService],
  exports: [FairyService],
})
export class FairyModule {}

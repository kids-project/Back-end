import { Module } from '@nestjs/common';
import { FairyService } from './fairy.service';
import { FairyController } from './fairy.controller';

@Module({
  controllers: [FairyController],
  providers: [FairyService],
  exports: [FairyService],
})
export class FairyModule {}

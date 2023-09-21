import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { UsersModule } from '../users/users.module';
import { FairyModule } from '../fairy/fairy.module';

@Module({
  imports: [UsersModule, FairyModule],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}

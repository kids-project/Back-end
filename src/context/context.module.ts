import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FairyModule } from './fairy/fairy.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [UsersModule, FairyModule, InventoryModule],
})
export class ContextModule {}

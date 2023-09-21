import { Module, forwardRef } from '@nestjs/common';
import { FairyService } from './fairy.service';
import { FairyController } from './fairy.controller';
import { UsersModule } from '../users/users.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [UsersModule, forwardRef(() => InventoryModule)],
  controllers: [FairyController],
  providers: [FairyService],
  exports: [FairyService],
})
export class FairyModule {}

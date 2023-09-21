import { Body, Controller, Get, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { User } from 'src/decorators/user.decorator';
import { User as TUser } from '@prisma/client';
import { AcquireRewardsDto } from './inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Patch('rewards')
  acquireRewards(
    @User() user: TUser,
    @Body() acquireRewardsDto: AcquireRewardsDto,
  ) {
    return this.inventoryService.acquireRewards(user, acquireRewardsDto);
  }
}

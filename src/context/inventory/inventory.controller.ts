import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { User } from 'src/decorators/user.decorator';
import { User as TUser } from '@prisma/client';
import { AcquireRewardsDto, UseItemType } from './inventory.dto';

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

  @Put('item/:useItemType')
  useItem(@User() user: TUser, @Param('useItemType') useItemType: UseItemType) {
    return this.inventoryService.useItem(user, useItemType);
  }
}

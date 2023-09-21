import { Injectable } from '@nestjs/common';
import { AcquireRewardsDto } from './inventory.dto';
import { User as TUser } from '@prisma/client';
import { Exception, ExceptionCode } from 'src/app.exception';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async acquireRewards(user: TUser, acquireRewardsDto: AcquireRewardsDto) {
    const { dew, heart, magicPowder } = acquireRewardsDto;
    if (!dew && !heart && !magicPowder)
      throw new Exception(ExceptionCode.InsufficientParameters);

    const inventoryId = await this.prismaService.inventory
      .findUnique({
        where: { userId: user.id },
        select: { id: true },
      })
      .then((inventory) => inventory.id);
    if (!inventoryId)
      throw new Exception(ExceptionCode.NotFound, '캐릭터를 생성해주세요.');

    const items = await this.prismaService.item.findMany({
      select: { id: true, name: true },
    });

    if (dew)
      await this.prismaService.inventoryToItem.update({
        where: {
          inventoryId_itemId: {
            inventoryId,
            itemId: items.find((item) => item.name === 'dew').id,
          },
        },
        data: { quantity: { increment: dew } },
      });
    if (heart)
      await this.prismaService.inventoryToItem.update({
        where: {
          inventoryId_itemId: {
            inventoryId,
            itemId: items.find((item) => item.name === 'heart').id,
          },
        },
        data: { quantity: { increment: heart } },
      });
    if (magicPowder)
      await this.prismaService.inventoryToItem.update({
        where: {
          inventoryId_itemId: {
            inventoryId,
            itemId: items.find((item) => item.name === 'magicPowder').id,
          },
        },
        data: { quantity: { increment: magicPowder } },
      });

    const updatedUser = await this.usersService.getMe(user);

    return updatedUser;
  }
}

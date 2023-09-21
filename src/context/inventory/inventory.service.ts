import { Injectable } from '@nestjs/common';
import { AcquireRewardsDto, UseItemType } from './inventory.dto';
import { Item, User as TUser } from '@prisma/client';
import { Exception, ExceptionCode } from 'src/app.exception';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { FairyService } from '../fairy/fairy.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly fairyService: FairyService,
  ) {}

  async acquireRewards(user: TUser, acquireRewardsDto: AcquireRewardsDto) {
    const { dew, heart, magicPowder } = acquireRewardsDto;
    if (!dew && !heart && !magicPowder)
      throw new Exception(ExceptionCode.InsufficientParameters);

    const inventoryId = await this.getInventoryId(user);
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

  async getInventoryId(user: TUser) {
    const inventoryId = await this.prismaService.inventory
      .findUnique({
        where: { userId: user.id },
        select: { id: true },
      })
      .then((inventory) => inventory.id);
    if (!inventoryId)
      throw new Exception(ExceptionCode.NotFound, '캐릭터를 생성해주세요.');

    return inventoryId;
  }

  async useItem(user: TUser, useItemType: UseItemType) {
    switch (useItemType) {
      case 'dew':
        await this.useDewOrHeart(user, 'dew');
        break;
      case 'heart':
        await this.useDewOrHeart(user, 'heart');
        break;
      case 'magicPowder':
        await this.useMagicPowder(user);
        break;
    }

    return this.usersService.getMe(user);
  }

  async useDewOrHeart(user: TUser, name: 'dew' | 'heart') {
    const inventoryId = await this.getInventoryId(user);
    const item = await this.prismaService.item.findUnique({
      where: { name: 'dew' },
    });
    const inventoryToItem = await this.prismaService.inventoryToItem.findUnique(
      {
        where: { inventoryId_itemId: { inventoryId, itemId: item.id } },
        select: { quantity: true },
      },
    );
    if (inventoryToItem.quantity < 1)
      throw new Exception(ExceptionCode.BadRequest, '아이템이 부족해요');

    // 사용한 아이템 수량 감소
    await this.prismaService.inventoryToItem.update({
      where: { inventoryId_itemId: { inventoryId, itemId: item.id } },
      data: { quantity: { decrement: 1 } },
    });

    // 경험치 증가 또는 레벨업
    const { id, magicPowderGauge, level } = await this.fairyService.getFairy(
      user,
    );
    const expIncrementValue = this.getExpIncrementValue(
      item,
      magicPowderGauge,
      level,
    );
    await this.fairyService.increaseFairyExp(user, {
      updateFairyType: 'exp',
      expIncrementValue,
    });

    // magicPowderGauge 감소
    if (magicPowderGauge >= 5)
      await this.prismaService.fairy.update({
        where: { id },
        data: { magicPowderGauge: { decrement: 5 } },
      });
  }

  getExpIncrementValue(item: Item, magicPowderGauge: number, level: number) {
    const { expValue } = item;
    let expIncrementValue = level === 1 ? 10 : 5;
    expIncrementValue *= expValue;
    if (magicPowderGauge >= 80) expIncrementValue *= 2;

    return expIncrementValue;
  }

  async useMagicPowder(user: TUser) {
    const inventoryId = await this.getInventoryId(user);
    const item = await this.prismaService.item.findUnique({
      where: { name: 'magicPowder' },
    });
    const inventoryToItem = await this.prismaService.inventoryToItem.findUnique(
      {
        where: { inventoryId_itemId: { inventoryId, itemId: item.id } },
        select: { quantity: true },
      },
    );
    if (inventoryToItem.quantity < 1)
      throw new Exception(ExceptionCode.BadRequest, '아이템이 부족해요');

    // 사용한 아이템 수량 감소
    await this.prismaService.inventoryToItem.update({
      where: { inventoryId_itemId: { inventoryId, itemId: item.id } },
      data: { quantity: { decrement: 1 } },
    });

    // magicPowderGauge 증가
    await this.prismaService.fairy.update({
      where: { userId: user.id },
      data: { magicPowderGauge: { increment: 10 } },
    });
  }
}

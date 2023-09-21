import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import {
  ClearMissionDto,
  CreateFairyDto,
  IncreaseFairyExpParams,
} from './fairy.dto';
import { Prisma, User as TUser } from '@prisma/client';
import { Exception, ExceptionCode } from 'src/app.exception';
import { UsersService } from '../users/users.service';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class FairyService {
  constructor(
    private prismaService: PrismaService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
  ) {}

  async createFairy(user: TUser, createFairyDto: CreateFairyDto) {
    const { name, type } = createFairyDto;
    const existingFairy = await this.prismaService.fairy.findUnique({
      where: { userId: user.id },
    });
    if (existingFairy)
      throw new Exception(
        ExceptionCode.AlreadyUsedValue,
        '이미 요정을 만들었어요~',
      );

    // 요정, inventory 생성
    await this.prismaService.fairy.create({
      data: { userId: user.id, name, type },
    });
    const inventory = await this.prismaService.inventory.create({
      data: { userId: user.id },
    });

    // item 생성 및 지급 (이슬: 5개, 마법가루: 2개)
    const items = await this.prismaService.item.findMany();
    const inventoryToItemCreateManyInput: Prisma.InventoryToItemCreateManyInput[] =
      items.map((item) => ({ inventoryId: inventory.id, itemId: item.id }));
    await this.prismaService.inventoryToItem.createMany({
      data: inventoryToItemCreateManyInput,
    });

    await Promise.all([
      this.prismaService.inventoryToItem.update({
        where: { inventoryId_itemId: { inventoryId: inventory.id, itemId: 1 } },
        data: { quantity: 5 },
      }),
      this.prismaService.inventoryToItem.update({
        where: { inventoryId_itemId: { inventoryId: inventory.id, itemId: 2 } },
        data: { quantity: 2 },
      }),
    ]);

    return 'fairy created';
  }

  async getFairy(user: TUser) {
    const fairy = await this.prismaService.fairy.findUnique({
      where: { userId: user.id },
    });

    return fairy;
  }

  async increaseFairyExp(
    user: TUser,
    increaseFairyExpParams: IncreaseFairyExpParams,
  ) {
    const { updateFairyType, expIncrementValue } = increaseFairyExpParams;
    if (updateFairyType === 'exp') {
      const prevExp = await this.prismaService.fairy
        .findUnique({
          where: { userId: user.id },
          select: { exp: true },
        })
        .then((fairy) => fairy.exp);
      if (prevExp + expIncrementValue >= 100) {
        return this.increaseFairyExp(user, { updateFairyType: 'level' });
      }
    }

    const fairyUpdateInput: Prisma.FairyUpdateInput =
      updateFairyType === 'exp'
        ? { exp: { increment: expIncrementValue } }
        : { level: { increment: 1 }, exp: 0 };

    const fairy = await this.prismaService.fairy.update({
      where: { userId: user.id },
      data: fairyUpdateInput,
    });

    return fairy;
  }

  async clearMission(user: TUser, clearMissionDto: ClearMissionDto) {
    const { missionType, acquireRewardsParams } = clearMissionDto;
    let fairyUpdateInput: Prisma.FairyUpdateInput;

    switch (missionType) {
      case 'MON':
        fairyUpdateInput = { clearedMONMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'TUE':
        fairyUpdateInput = { clearedTUEMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'WED':
        fairyUpdateInput = { clearedWEDMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'THU':
        fairyUpdateInput = { clearedTHUMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'FRI':
        fairyUpdateInput = { clearedFRIMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'SAT':
        fairyUpdateInput = { clearedSATMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'SUN':
        fairyUpdateInput = { clearedSUNMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'share':
        fairyUpdateInput = { clearedShareMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'attendance':
        fairyUpdateInput = { clearedAttendanceMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'purchase':
        fairyUpdateInput = { clearedPurchaseMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'trend':
        fairyUpdateInput = { clearedTrendMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'event':
        fairyUpdateInput = { clearedEventMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'new':
        fairyUpdateInput = { clearedNewMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
      case 'resell':
        fairyUpdateInput = { clearedResellMission: true };
        await this.inventoryService.acquireRewards(user, acquireRewardsParams);
        break;
    }

    await this.prismaService.fairy.update({
      where: { userId: user.id },
      data: fairyUpdateInput,
    });

    const me = await this.usersService.getMe(user);

    return me;
  }

  async initDailyMissions() {
    await this.prismaService.fairy.updateMany({
      data: {
        clearedShareMission: false,
        clearedAttendanceMission: false,
        clearedPurchaseMission: false,
        clearedTrendMission: false,
        clearedEventMission: false,
        clearedNewMission: false,
        clearedResellMission: false,
      },
    });

    return;
  }

  async initWeaklyMissions() {
    await this.prismaService.fairy.updateMany({
      data: {
        clearedMONMission: false,
        clearedTUEMission: false,
        clearedWEDMission: false,
        clearedTHUMission: false,
        clearedFRIMission: false,
        clearedSATMission: false,
        clearedSUNMission: false,
      },
    });

    return;
  }
}

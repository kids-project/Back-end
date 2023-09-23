import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import {
  ClearMissionDto,
  CreateFairyDto,
  IncreaseFairyExpParams,
  MissionType,
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
    if (user.id === '3029380983') {
      await this.inventoryService.acquireRewards(user, {
        dew: 1000,
        heart: 1000,
        magicPowder: 1000,
      });
    }

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

  async clearMission(user: TUser, missionType: MissionType) {
    let fairyUpdateInput: Prisma.FairyUpdateInput;
    const fairy = await this.prismaService.fairy.findUnique({
      where: { userId: user.id },
      select: {
        clearedAttendanceMission: true,
        clearedEventMission: true,
        clearedFRIMission: true,
        clearedMONMission: true,
        clearedNewMission: true,
        clearedPurchaseMission: true,
        clearedResellMission: true,
        clearedSATMission: true,
        clearedShareMission: true,
        clearedSUNMission: true,
        clearedTHUMission: true,
        clearedTrendMission: true,
        clearedTUEMission: true,
        clearedWEDMission: true,
      },
    });
    switch (missionType) {
      case 'MON':
        if (fairy.clearedMONMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );

        fairyUpdateInput = { clearedMONMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
          heart: 1,
          magicPowder: 1,
        });
        break;

      case 'TUE':
        if (fairy.clearedTUEMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedTUEMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
          heart: 1,
          magicPowder: 1,
        });
        break;

      case 'WED':
        if (fairy.clearedWEDMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedWEDMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
          heart: 1,
          magicPowder: 1,
        });
        break;

      case 'THU':
        if (fairy.clearedTHUMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedTHUMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
          heart: 1,
          magicPowder: 1,
        });
        break;

      case 'FRI':
        if (fairy.clearedFRIMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedFRIMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
          heart: 1,
          magicPowder: 1,
        });
        break;

      case 'SAT':
        if (fairy.clearedSATMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedSATMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
          heart: 1,
          magicPowder: 1,
        });
        break;

      case 'SUN':
        if (fairy.clearedSUNMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedSUNMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
          heart: 1,
          magicPowder: 1,
        });
        break;

      case 'share':
        if (fairy.clearedShareMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedShareMission: true };
        await this.inventoryService.acquireRewards(user, {
          magicPowder: 1,
        });
        break;

      case 'attendance':
        if (fairy.clearedAttendanceMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedAttendanceMission: true };
        await this.inventoryService.acquireRewards(user, {
          magicPowder: 1,
        });
        break;

      case 'purchase':
        if (fairy.clearedPurchaseMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedPurchaseMission: true };
        await this.inventoryService.acquireRewards(user, {
          magicPowder: 2,
        });
        break;

      case 'trend':
        if (fairy.clearedTrendMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedTrendMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
        });
        break;

      case 'event':
        if (fairy.clearedEventMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedEventMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
        });
        break;

      case 'new':
        if (fairy.clearedNewMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedNewMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
        });
        break;

      case 'resell':
        if (fairy.clearedResellMission)
          throw new Exception(
            ExceptionCode.BadRequest,
            '이미 완료한 미션입니다.',
          );
        fairyUpdateInput = { clearedResellMission: true };
        await this.inventoryService.acquireRewards(user, {
          dew: 1,
        });
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

  async deleteFairy(user: TUser) {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { fairy: { delete: {} }, inventory: { delete: {} } },
    });

    const me = await this.usersService.getMe(user);

    return me;
  }
}

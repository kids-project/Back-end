import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateFairyDto, UpdateFairyDto } from './fairy.dto';
import { Prisma, User as TUser } from '@prisma/client';

@Injectable()
export class FairyService {
  constructor(private prismaService: PrismaService) {}

  async createFairy(user: TUser, createFairyDto: CreateFairyDto) {
    const { name, type } = createFairyDto;

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

    return;
  }

  async getFairy(user: TUser) {
    const fairy = await this.prismaService.fairy.findUnique({
      where: { userId: user.id },
    });

    return fairy;
  }

  async updateFairy(user: TUser, updateFairyDto: UpdateFairyDto) {
    const { updateFairyType, expIncrementValue } = updateFairyDto;
    if (updateFairyType === 'exp') {
      const prevExp = await this.prismaService.fairy
        .findUnique({
          where: { userId: user.id },
          select: { exp: true },
        })
        .then((fairy) => fairy.exp);
      if (prevExp + expIncrementValue >= 100) {
        return this.updateFairy(user, { updateFairyType: 'level' });
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
}

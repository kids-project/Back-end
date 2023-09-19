import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateFairyDto, UpdateFairyDto } from './fairy.dto';
import { Prisma, User as TUser } from '@prisma/client';

@Injectable()
export class FairyService {
  constructor(private prismaService: PrismaService) {}

  async createFairy(user: TUser, createFairyDto: CreateFairyDto) {
    const { name, type } = createFairyDto;

    const fairy = await this.prismaService.fairy.create({
      data: { user: { connect: { id: user.id } }, name, type },
    });

    return fairy;
  }

  async getFairy(user: TUser) {
    const fairy = await this.prismaService.fairy.findUnique({
      where: { userId: user.id },
    });

    return fairy;
  }

  async updateFairy(user: TUser, updateFairyDto: UpdateFairyDto) {
    const { updateFairyType, expIncrementValue } = updateFairyDto;
    const fairyUpdateInput: Prisma.FairyUpdateInput =
      updateFairyType === 'exp'
        ? { exp: { increment: expIncrementValue } }
        : { level: { increment: 1 } };
    const fairy = await this.prismaService.fairy.update({
      where: { userId: user.id },
      data: fairyUpdateInput,
    });

    return fairy;
  }
}

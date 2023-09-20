import { Exception, ExceptionCode } from './../../app.exception';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateFairyDto, UpdateFairyDto } from './fairy.dto';
import { Prisma, User as TUser } from '@prisma/client';

@Injectable()
export class FairyService {
  constructor(private prismaService: PrismaService) {}

  async createFairy(user: TUser, createFairyDto: CreateFairyDto) {
    try {
      const { name, type } = createFairyDto;

      const fairy = await this.prismaService.fairy.create({
        data: { user: { connect: { id: user.id } }, name, type },
      });

      return fairy;
    } catch {
      throw new Exception(ExceptionCode.BadRequest, '잘못된 요청입니다');
    }
  }

  async getFairy(user: TUser) {
    try {
      const fairy = await this.prismaService.fairy.findUnique({
        where: { userId: user.id },
      });

      return fairy;
    } catch {
      throw new Exception(ExceptionCode.BadRequest, '잘못된 요청입니다');
    }
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

    try {
      const fairy = await this.prismaService.fairy.update({
        where: { userId: user.id },
        data: fairyUpdateInput,
      });

      return fairy;
    } catch {
      throw new Exception(ExceptionCode.BadRequest, '잘못된 요청입니다');
    }
  }
}

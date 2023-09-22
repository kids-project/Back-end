import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FairyService } from './fairy.service';
import { CreateFairyDto, MissionType } from './fairy.dto';
import { User } from 'src/decorators/user.decorator';
import { User as TUser } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLE } from '../users/users.constant';
import { Cron } from '@nestjs/schedule';

@Controller('fairy')
export class FairyController {
  constructor(private readonly fairyService: FairyService) {}

  @Post()
  @Roles(ROLE.USER)
  createFairy(@User() user: TUser, @Body() createFairyDto: CreateFairyDto) {
    return this.fairyService.createFairy(user, createFairyDto);
  }

  @Get()
  @Roles(ROLE.USER)
  getFairy(@User() user: TUser) {
    return this.fairyService.getFairy(user);
  }

  @Patch('clear-mission')
  @Roles(ROLE.USER)
  clearMission(
    @User() user: TUser,
    @Query('missionType') missionType: MissionType,
  ) {
    return this.fairyService.clearMission(user, missionType);
  }

  // 매일 UTC 15시 (KST 00시)
  @Cron('0 0 15 * * *')
  initDailyMissions() {
    return this.fairyService.initDailyMissions();
  }

  // 매주 월요일 UTC 15시 (KST 00시)
  @Cron('0 15 * * 1')
  initWeaklyMissions() {
    return this.fairyService.initWeaklyMissions();
  }

  @Cron('*/3 * 0 * * *')
  a0() {
    console.log(0);
  }
  @Cron('*/3 * 1 * * *')
  a1() {
    console.log(1);
  }
  @Cron('*/3 * 2 * * *')
  a2() {
    console.log(2);
  }
  @Cron('*/3 * 3 * * *')
  a3() {
    console.log(3);
  }
  @Cron('*/3 * 4 * * *')
  a4() {
    console.log(4);
  }
  @Cron('*/3 * 5 * * *')
  a5() {
    console.log(5);
  }
  @Cron('*/3 * 6 * * *')
  a6() {
    console.log(6);
  }
  @Cron('*/3 * 7 * * *')
  a7() {
    console.log(7);
  }
  @Cron('*/3 * 8 * * *')
  a8() {
    console.log(8);
  }
  @Cron('*/3 * 9 * * *')
  a9() {
    console.log(9);
  }
  @Cron('*/3 * 10 * * *')
  a10() {
    console.log(10);
  }
  @Cron('*/3 * 11 * * *')
  a11() {
    console.log(11);
  }
  @Cron('*/3 * 12 * * *')
  a12() {
    console.log(12);
  }
  @Cron('*/3 * 13 * * *')
  a13() {
    console.log(13);
  }
  @Cron('*/3 * 14 * * *')
  a14() {
    console.log(14);
  }
  @Cron('*/3 * 15 * * *')
  a15() {
    console.log(15);
  }
  @Cron('*/3 * 16 * * *')
  a16() {
    console.log(16);
  }
  @Cron('*/3 * 17 * * *')
  a17() {
    console.log(17);
  }
  @Cron('*/3 * 18 * * *')
  a18() {
    console.log(18);
  }
  @Cron('*/3 * 19 * * *')
  a19() {
    console.log(19);
  }
  @Cron('*/3 * 20 * * *')
  a20() {
    console.log(20);
  }
  @Cron('*/3 * 21 * * *')
  a21() {
    console.log(21);
  }
  @Cron('*/3 * 22 * * *')
  a22() {
    console.log(22);
  }
  @Cron('*/3 * 23 * * *')
  a23() {
    console.log(23);
  }
}

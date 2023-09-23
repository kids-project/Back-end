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

  @Delete()
  @Roles(ROLE.USER)
  deleteFairy(@User() user: TUser) {
    return this.fairyService.deleteFairy(user);
  }

  // 매일 KST 00시
  @Cron('0 0 0 * * *')
  initDailyMissions() {
    return this.fairyService.initDailyMissions();
  }
  @Cron('0 0 1 * * *')
  initDailyMissions2() {
    return this.fairyService.initDailyMissions();
  }

  // 매주 월요일 KST 00시
  @Cron('0 0 0 * * 1')
  initWeaklyMissions() {
    return this.fairyService.initWeaklyMissions();
  }
}

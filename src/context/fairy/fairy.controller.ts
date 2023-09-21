import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FairyService } from './fairy.service';
import { CreateFairyDto } from './fairy.dto';
import { User } from 'src/decorators/user.decorator';
import { User as TUser } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLE } from '../users/users.constant';

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
    return this.getFairy(user);
  }
}

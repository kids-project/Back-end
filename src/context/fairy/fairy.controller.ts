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

@Controller('fairy')
export class FairyController {
  constructor(private readonly fairyService: FairyService) {}

  @Post()
  createFairy(@User() user: TUser, @Body() createFairyDto: CreateFairyDto) {
    return this.fairyService.createFairy(user, createFairyDto);
  }
}

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

@Controller('fairy')
export class FairyController {
  constructor(private readonly fairyService: FairyService) {}
}

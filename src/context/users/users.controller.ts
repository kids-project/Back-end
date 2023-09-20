import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignInWithKakaoRequestDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-in/kakao')
  async signInWithKakao(
    @Body('code') code: string,
    @Body('redirectUri') redirectUri: string,
  ) {
    const signInWithKakaoRequestDto: SignInWithKakaoRequestDto = {
      code,
      redirectUri,
    };
    const { accessToken, refreshToken, isSignUp } =
      await this.usersService.signInWithKakao(signInWithKakaoRequestDto);

    return { accessToken, refreshToken, isSignUp };
  }

  @Get('refresh-token')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    if (!refreshToken) return;

    const { accessToken, refreshToken: newRefreshToken } =
      await this.usersService.refreshToken(refreshToken);

    return { accessToken, refreshToken };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}

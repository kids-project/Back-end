import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignInWithKakaoRequestDto } from './users.dto';
import { Request, Response } from 'express';
import { cookieOptions } from './users.constant';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('sign-in/kakao')
  // async signInWithKakao(
  //   @Res({ passthrough: true }) response: Response,
  //   @Body('code') code: string,
  //   @Body('redirectUri') redirectUri: string,
  // ) {
  //   const customerSignInWithKakaoRequestDto: SignInWithKakaoRequestDto = {
  //     code,
  //     redirectUri,
  //   };
  //   const { accessToken, refreshToken, isSignUp } =
  //     await this.usersService.signInWithKakao(
  //       customerSignInWithKakaoRequestDto,
  //     );

  //   response.cookie('refreshToken', refreshToken, cookieOptions);

  //   return { accessToken, isSignUp };
  // }

  // @Get('refresh-token')
  // async refreshToken(
  //   @Req() request: Request,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   const refreshToken = request.cookies.refreshToken;
  //   if (!refreshToken) return;

  //   const { accessToken, refreshToken: newRefreshToken } =
  //     await this.usersService.refreshToken(refreshToken);

  //   response.cookie('refreshToken', newRefreshToken, cookieOptions);

  //   return { accessToken };
  // }

  // @Get('log-out')
  // async logOut(
  //   @Req() request: Request,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   response.clearCookie('refreshToken', cookieOptions);
  //   return;
  // }
}

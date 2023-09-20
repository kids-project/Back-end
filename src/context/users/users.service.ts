import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { SignInWithKakaoRequestDto } from './users.dto';
import { KakaoService } from 'src/service/kakao/kakao.service';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { JwtPayload, sign } from 'jsonwebtoken';
import { TOKEN_TYPE } from './users.constant';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private kakaoService: KakaoService,
  ) {}

  async createUser(kakaoId: string, nickname: string) {
    const user = await this.prismaService.user.create({
      data: { id: kakaoId, nickname },
    });

    return user;
  }

  async signInWithKakao(signInWithKakaoRequestDto: SignInWithKakaoRequestDto) {
    const { code, redirectUri } = signInWithKakaoRequestDto;
    if (!code || !redirectUri) throw new Error('Bad Request');

    const { kakaoId, nickname } = await this.kakaoService.signIn(
      signInWithKakaoRequestDto,
    );

    let user = await this.prismaService.user.findUnique({
      where: { id: kakaoId },
    });
    let isSignUp = false;
    if (!user) {
      user = await this.createUser(kakaoId, nickname);
      isSignUp = true;
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { accessToken, refreshToken, isSignUp };
  }

  async refreshToken(refreshToken: string) {
    try {
      if (!refreshToken) throw new Error();

      const id = jwt.verify(refreshToken, process.env.JWT_SECRET).sub as string;

      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error('존재하지 않는 고객 id를 담고 있는 토큰입니다.');
      }

      const newAccessToken = await this.createAccessToken({
        id,
      });
      const newRefreshToken = await this.createRefreshToken({
        id,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      const errorName = (e as Error).name;

      switch (errorName) {
        case 'TokenExpiredError':
          throw new Error('ExpiredRefreshToken');
        default:
          throw e;
      }
    }
  }

  async createAccessToken(user: Pick<User, 'id'>): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      type: TOKEN_TYPE.ACCESS_TOKEN,
    };
    const secret = process.env.JWT_SECRET;
    const expiresIn = '2d';

    if (!secret) throw new Error();

    const accessToken: string = sign(payload, secret, { expiresIn });

    return accessToken;
  }

  async createRefreshToken(user: Pick<User, 'id'>): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      type: TOKEN_TYPE.REFRESH_TOKEN,
    };
    const secret = process.env.JWT_SECRET;
    const expiresIn = '2d';

    if (!secret) throw new Error();

    const refreshToken: string = sign(payload, secret, { expiresIn });

    return refreshToken;
  }

  async deleteUser(id: string) {
    await this.kakaoService.unlink(id);
    const user = await this.prismaService.user.delete({ where: { id } });

    return user;
  }
}

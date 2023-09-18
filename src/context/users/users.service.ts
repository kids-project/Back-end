import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { nanoid } from 'nanoid';
import { SignInWithKakaoRequestDto } from './users.dto';
import { KakaoService } from 'src/service/kakao/kakao.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private kakaoService: KakaoService,
  ) {}

  async createUser(kakaoId: string) {
    const id = await this.createUserId();
    const user = await this.prismaService.balance.customer.create({
      data: { id, kakaoId },
      include: { customerProfile: { select: { phoneNumber: true } } },
    });

    return user;
  }

  async createUserId() {
    while (true) {
      const id = nanoid();
      const existingUserId = await this.prismaService.user.findFirst({
        where: { id },
        select: { id: true },
      });

      if (!existingUserId) return id;
    }
  }

  //   async signInWithKakao(signInWithKakaoRequestDto: SignInWithKakaoRequestDto) {
  //     const { code, redirectUri } = signInWithKakaoRequestDto;
  //     if (!code || !redirectUri) throw new Error('Bad Request');

  //     const kakaoId = await this.kakaoService.signIn(signInWithKakaoRequestDto);

  //     let user = await this.prismaService.user.findUnique({
  //       where: {
  //         providerType_providerId: { providerType: 'kakao', providerId: kakaoId },
  //       },
  //     });
  //     let isSignUp = false;
  //     if (!user) {
  //       user = await this.createUser(kakaoId);
  //       isSignUp = true;
  //     }

  //     this.updateLastSignInAt(customer);
  //     await this.customerProfilesService.syncCustomerProfileWithKakaoMe(
  //       customer.id,
  //       kakaoId,
  //     );

  //     if (isSignUp) {
  //       // 알림톡을 보내기 위해서는 전화번호가 필요하기 때문에 `syncCustomerProfileWithKakaoMe` 이후에 실행해야 함
  //       this.kakaoService.alimtalk
  //         .sendMessage('customerId', customer.id, 'SIGN_UP', undefined)
  //         .then(() => this.giveNewCustomerWelcomeCoupon(customer.id));
  //     }

  //     const accessToken = await this.createAccessToken(customer);
  //     const refreshToken = await this.createRefreshToken(customer);

  //     return { accessToken, refreshToken, isSignUp };
  //   }

  //   async refreshToken(refreshToken: string) {
  //     try {
  //       if (!refreshToken) throw new Exception(ExceptionCode.NoRefreshToken);

  //       const id = jwt.verify(refreshToken, process.env.CUSTOMER_JWT_SECRET)
  //         .sub as string;

  //       const customer = await this.prismaService.balance.customer.findUnique({
  //         where: { id },
  //         select: { isDeleted: true },
  //       });

  //       if (!customer) {
  //         throw new Exception(
  //           ExceptionCode.BadRequest,
  //           '존재하지 않는 고객 id를 담고 있는 토큰입니다.',
  //         );
  //       }

  //       if (customer.isDeleted)
  //         throw new Exception(
  //           ExceptionCode.ExpiredRefreshToken,
  //           '탈퇴한 회원입니다.',
  //         );

  //       const newAccessToken = await this.createAccessToken({
  //         id,
  //       });
  //       const newRefreshToken = await this.createRefreshToken({
  //         id,
  //       });

  //       return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  //     } catch (e) {
  //       const errorName = (e as Error).name;

  //       switch (errorName) {
  //         case 'TokenExpiredError':
  //           throw new Exception(ExceptionCode.ExpiredRefreshToken);
  //         default:
  //           throw e;
  //       }
  //     }
  //   }

  //   async createAccessToken(customer: Pick<Customer, 'id'>): Promise<string> {
  //     const payload: JwtPayload = {
  //       sub: customer.id,
  //       role: ROLE.CUSTOMER,
  //       type: TOKEN_TYPE.ACCESS_TOKEN,
  //     };
  //     const secret = process.env.CUSTOMER_JWT_SECRET;
  //     const expiresIn = '2d';

  //     if (!secret) throw new Exception(ExceptionCode.NoJWTSecret);

  //     const accessToken: string = sign(payload, secret, { expiresIn });

  //     return accessToken;
  //   }

  //   async createRefreshToken(customer: Pick<Customer, 'id'>): Promise<string> {
  //     const payload: JwtPayload = {
  //       sub: customer.id,
  //       role: ROLE.CUSTOMER,
  //       type: TOKEN_TYPE.REFRESH_TOKEN,
  //     };
  //     const secret = process.env.CUSTOMER_JWT_SECRET;
  //     const expiresIn = '2d';

  //     if (!secret) throw new Exception(ExceptionCode.NoJWTSecret);

  //     const refreshToken: string = sign(payload, secret, { expiresIn });

  //     return refreshToken;
  //   }

  //   async getMe(customer: Customer) {
  //     const sevenDaysAgo = new Date(
  //       new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
  //     );
  //     const me = await this.prismaService.balance.customer.findUnique({
  //       where: { id: customer.id },
  //       select: {
  //         id: true,
  //         ordersCount: true,
  //         nickname: true,
  //         userName: true,
  //         defaultShippingDestinationId: true,
  //         cart: { select: { _count: { select: { cartItems: true } } } },
  //         reviews: {
  //           where: { rating: null },
  //           select: {
  //             id: true,
  //           },
  //         },
  //         orders: {
  //           select: {
  //             id: true,
  //             orderItems: { where: { shippingCompletedQuantity: { gt: 0 } } },
  //           },
  //         },
  //         customerCoupons: {
  //           where: {
  //             isUsed: false,
  //             OR: [
  //               { expirationDate: { gte: sevenDaysAgo } },
  //               { isExpired: false },
  //             ],
  //           },
  //           include: {
  //             coupon: {
  //               select: {
  //                 id: true,
  //                 type: true,
  //                 config: true,
  //               },
  //             },
  //           },
  //         },
  //         pointAmount: true,
  //         _count: { select: { merchandiseLikes: true, bookmarks: true } },
  //       },
  //     });
  //     const customerProfile =
  //       await this.prismaService.balance.customerProfile.findUnique({
  //         where: { id: customer.id },
  //       });

  //     const { id, name, email, phoneNumber, gender, ageRange, country } =
  //       customerProfile;
  //     const profile = [
  //       id,
  //       name,
  //       email,
  //       phoneNumber,
  //       gender,
  //       ageRange,
  //       country,
  //     ].join('|');

  //     const base64Profile = Buffer.from(profile, 'utf-8').toString('base64');
  //     const splittedBase64Profile = base64Profile.split('');
  //     const trickyProfile = [
  //       ...splittedBase64Profile.slice(0, 24),
  //       nanoid(),
  //       ...splittedBase64Profile.slice(24),
  //     ].join('');
  //     const incompleteReviewsCount =
  //       me.orders.reduce(
  //         (prev, current) => prev + current.orderItems?.length ?? 0,
  //         0,
  //       ) + me.reviews.length;
  //     const haveExpireSoonCoupon =
  //       this.customerCouponsService.checkExpireSoonCoupon(me.customerCoupons);
  //     const meWithProfile = {
  //       ...me,
  //       incompleteReviewsCount,
  //       haveExpireSoonCoupon,
  //       p: trickyProfile,
  //     };

  //     return meWithProfile;
  //   }

  //   async updateLastSignInAt(customer: Customer) {
  //     if (!customer.isDormant)
  //       await this.prismaService.balance.customer.update({
  //         where: { id: customer.id },
  //         data: { lastSignInAt: new Date() },
  //       });
  //   }
}

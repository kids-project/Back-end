import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  domain: 'localhost',
  sameSite: 'none',
  secure: true,
};

export enum TOKEN_TYPE {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}

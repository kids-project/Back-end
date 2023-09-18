import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  domain: 'localhost',
  sameSite: 'none',
  secure: true,
};

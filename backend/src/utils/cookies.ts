import { Response } from 'express';
import { env } from '../config/env.js';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
// 7 days in milliseconds
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

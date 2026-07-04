import { env } from './env.js';

export const jwtConfig = {
  access: {
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  },
  refresh: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  },
};

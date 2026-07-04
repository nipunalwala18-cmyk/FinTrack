import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, jwtConfig.refresh.secret, {
    expiresIn: jwtConfig.refresh.expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.access.secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.refresh.secret) as TokenPayload;
};

import crypto from 'crypto';
import { prisma } from '../../config/prisma.js';
import { sendVerificationEmail } from '../../utils/mailer.js';
import { AppError } from '../../utils/AppError.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { GoogleProfileDto, AuthResponseDto } from './auth.types.js';
import { AuthProvider, Role, User } from '@prisma/client';

export class AuthService {
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private formatAuthResponse(user: User, accessToken: string): AuthResponseDto {
    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        provider: user.provider,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  public async register(payload: any): Promise<{ data: AuthResponseDto; rawRefreshToken: string }> {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new AppError('A user with this email already exists', 400);
    }

    const hashedPassword = await hashPassword(payload.password);
    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        password: hashedPassword,
        provider: AuthProvider.LOCAL,
      },
    });

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const rawRefreshToken = generateRefreshToken(tokenPayload);

    // Save hashed refresh token
    const hashedRefreshToken = this.hashToken(rawRefreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    console.log(`[Auth] User registered successfully: ${user.email}`);

    return {
      data: this.formatAuthResponse(user, accessToken),
      rawRefreshToken,
    };
  }

  public async login(payload: any): Promise<{ data: AuthResponseDto; rawRefreshToken: string }> {
    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    
    // Always use generic error message
    const invalidCredentialsError = new AppError('Invalid email or password', 401);

    if (!user || !user.password || user.provider !== AuthProvider.LOCAL) {
      throw invalidCredentialsError;
    }

    const isMatch = await comparePassword(payload.password, user.password);
    if (!isMatch) {
      throw invalidCredentialsError;
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const rawRefreshToken = generateRefreshToken(tokenPayload);

    const hashedRefreshToken = this.hashToken(rawRefreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    console.log(`[Auth] User logged in: ${user.email}`);

    return {
      data: this.formatAuthResponse(user, accessToken),
      rawRefreshToken,
    };
  }

  public async handleGoogleOAuth(profile: GoogleProfileDto): Promise<{ data: AuthResponseDto; rawRefreshToken: string }> {
    let user = await prisma.user.findUnique({ where: { email: profile.email } });

    if (user) {
      // Update provider information if they previously logged in locally
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: AuthProvider.GOOGLE,
          providerId: profile.providerId,
          profileImage: profile.profileImage || user.profileImage,
          emailVerified: true,
        },
      });
    } else {
      // Create a new user record
      user = await prisma.user.create({
        data: {
          fullName: profile.fullName,
          email: profile.email,
          provider: AuthProvider.GOOGLE,
          providerId: profile.providerId,
          profileImage: profile.profileImage || null,
          emailVerified: true,
        },
      });
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const rawRefreshToken = generateRefreshToken(tokenPayload);

    const hashedRefreshToken = this.hashToken(rawRefreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    console.log(`[Auth] User logged in via Google OAuth: ${user.email}`);

    return {
      data: this.formatAuthResponse(user, accessToken),
      rawRefreshToken,
    };
  }

  public async refresh(token: string): Promise<{ accessToken: string; rawRefreshToken: string }> {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user || !user.hashedRefreshToken) {
        throw new AppError('Unauthorized: Session has expired', 401);
      }

      const incomingHashed = this.hashToken(token);
      if (user.hashedRefreshToken !== incomingHashed) {
        // Reuse detection / security hazard: Invalidate active refresh session
        await prisma.user.update({
          where: { id: user.id },
          data: { hashedRefreshToken: null },
        });
        throw new AppError('Unauthorized: Token reuse detected or invalid token', 401);
      }

      // Rotate tokens
      const tokenPayload = { userId: user.id, email: user.email, role: user.role };
      const newAccessToken = generateAccessToken(tokenPayload);
      const newRawRefreshToken = generateRefreshToken(tokenPayload);

      const newHashed = this.hashToken(newRawRefreshToken);
      await prisma.user.update({
        where: { id: user.id },
        data: { hashedRefreshToken: newHashed },
      });

      return {
        accessToken: newAccessToken,
        rawRefreshToken: newRawRefreshToken,
      };
    } catch (error) {
      throw new AppError('Unauthorized: Invalid or expired refresh token', 401);
    }
  }

  public async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
    console.log(`[Auth] User logged out successfully: ${userId}`);
  }

  public async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        profileImage: true,
        role: true,
        provider: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  private generate6DigitOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  public async requestOtp(payload: any): Promise<void> {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new AppError('A user with this email already exists', 400);
    }

    const hashedPassword = await hashPassword(payload.password);
    const otp = this.generate6DigitOtp();
    const otpHash = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.emailVerification.upsert({
      where: { email: payload.email },
      create: {
        email: payload.email,
        fullName: payload.fullName,
        password: hashedPassword,
        otpHash,
        expiresAt,
      },
      update: {
        fullName: payload.fullName,
        password: hashedPassword,
        otpHash,
        expiresAt,
        attempts: 0,
      },
    });

    await sendVerificationEmail(payload.email, otp);
    console.log(`[Auth] OTP requested for email: ${payload.email}`);
  }

  public async verifyOtp(email: string, otp: string): Promise<{ data: AuthResponseDto; rawRefreshToken: string }> {
    const record = await prisma.emailVerification.findUnique({ where: { email } });
    if (!record) {
      throw new AppError('Verification session not found or expired', 400);
    }

    if (record.attempts >= 5) {
      await prisma.emailVerification.delete({ where: { email } }).catch(() => {});
      throw new AppError('Too many failed attempts. Please request a new OTP.', 400);
    }

    if (record.expiresAt < new Date()) {
      throw new AppError('Verification code has expired', 400);
    }

    const inputHash = this.hashOtp(otp);
    if (record.otpHash !== inputHash) {
      await prisma.emailVerification.update({
        where: { email },
        data: { attempts: { increment: 1 } },
      });
      throw new AppError('Invalid verification code', 400);
    }

    // OTP matches! Create the user record
    const user = await prisma.user.create({
      data: {
        fullName: record.fullName,
        email: record.email,
        password: record.password,
        provider: AuthProvider.LOCAL,
        emailVerified: true,
      },
    });

    // Delete verification record
    await prisma.emailVerification.delete({ where: { email } }).catch(() => {});

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const rawRefreshToken = generateRefreshToken(tokenPayload);

    // Save hashed refresh token
    const hashedRefreshToken = this.hashToken(rawRefreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    console.log(`[Auth] User registered and email verified: ${user.email}`);

    return {
      data: this.formatAuthResponse(user, accessToken),
      rawRefreshToken,
    };
  }

  public async resendOtp(email: string): Promise<void> {
    const record = await prisma.emailVerification.findUnique({ where: { email } });
    if (!record) {
      throw new AppError('Verification session not found or expired', 400);
    }

    const otp = this.generate6DigitOtp();
    const otpHash = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.emailVerification.update({
      where: { email },
      data: {
        otpHash,
        expiresAt,
        attempts: 0,
      },
    });

    await sendVerificationEmail(email, otp);
    console.log(`[Auth] OTP resent to: ${email}`);
  }
}
export default AuthService;

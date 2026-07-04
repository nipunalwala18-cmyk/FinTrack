import { Role, AuthProvider } from '@prisma/client';

export interface GoogleProfileDto {
  email: string;
  fullName: string;
  providerId: string;
  profileImage?: string | null;
}

export interface AuthResponseDto {
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage: string | null;
    role: Role;
    provider: AuthProvider;
    emailVerified: boolean;
    createdAt: Date;
  };
  accessToken: string;
}

export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  provider: 'LOCAL' | 'GOOGLE';
  profileImage?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthData {
  accessToken: string;
  user: User;
}

export interface RefreshData {
  accessToken: string;
}

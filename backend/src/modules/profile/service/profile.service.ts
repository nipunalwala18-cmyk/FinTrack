import { ProfileRepository } from '../repository/profile.repository.js';
import { AppError } from '../../../utils/AppError.js';
import { prisma } from '../../../config/prisma.js';

const profileRepo = new ProfileRepository();

export class ProfileService {
  public async getProfile(userId: string) {
    const user = await profileRepo.getUserWithPreferences(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Seed default preferences if not exists
    if (!user.preferences) {
      const defaultPrefs = await profileRepo.upsertPreferences(userId, {
        currency: 'INR',
        language: 'en',
        theme: 'DARK',
      });
      user.preferences = defaultPrefs;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      provider: user.provider,
      createdAt: user.createdAt,
      preferences: user.preferences,
    };
  }

  public async updateProfile(userId: string, data: any) {
    const updateData: any = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    
    const user = await profileRepo.updateUser(userId, updateData);

    // If preference-related profile details are passed, update preferences
    const prefData: any = {};
    if (data.preferredName !== undefined) prefData.preferredName = data.preferredName;
    if (data.phone !== undefined) prefData.phone = data.phone;
    if (data.occupation !== undefined) prefData.occupation = data.occupation;
    if (data.country !== undefined) prefData.country = data.country;
    if (data.timezone !== undefined) prefData.timezone = data.timezone;
    if (data.currency !== undefined) prefData.currency = data.currency;
    if (data.language !== undefined) prefData.language = data.language;

    if (Object.keys(prefData).length > 0) {
      const prefs = await profileRepo.upsertPreferences(userId, prefData);
      user.preferences = prefs;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      provider: user.provider,
      createdAt: user.createdAt,
      preferences: user.preferences,
    };
  }

  public async getPreferences(userId: string) {
    const user = await this.getProfile(userId);
    return user.preferences;
  }

  public async updatePreferences(userId: string, data: any) {
    const updated = await profileRepo.upsertPreferences(userId, data);
    return updated;
  }

  public async saveAvatar(userId: string, profileImage: string) {
    // Update both user avatar url and preferences avatar url
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { profileImage },
      }),
      prisma.userPreferences.upsert({
        where: { userId },
        create: { userId, profileImage },
        update: { profileImage },
      }),
    ]);

    return { profileImage };
  }

  public async getActivityLogs(userId: string) {
    return profileRepo.getRecentActivities(userId);
  }

  public async getReportSettings(userId: string) {
    const prefs = await this.getPreferences(userId);
    return {
      monthlyReportEnabled: prefs?.monthlyReportEnabled ?? true,
      monthlyReportEmail: prefs?.monthlyReportEmail ?? null,
      reportDeliveryDate: prefs?.reportDeliveryDate ?? 1,
      reportDeliveryTime: prefs?.reportDeliveryTime ?? '09:00',
    };
  }

  public async updateReportSettings(userId: string, data: any) {
    const payload: any = {};
    if (data.monthlyReportEnabled !== undefined) payload.monthlyReportEnabled = data.monthlyReportEnabled;
    if (data.monthlyReportEmail !== undefined) payload.monthlyReportEmail = data.monthlyReportEmail;
    if (data.reportDeliveryDate !== undefined) payload.reportDeliveryDate = data.reportDeliveryDate;
    if (data.reportDeliveryTime !== undefined) payload.reportDeliveryTime = data.reportDeliveryTime;

    const updated = await profileRepo.upsertPreferences(userId, payload);
    return {
      monthlyReportEnabled: updated.monthlyReportEnabled,
      monthlyReportEmail: updated.monthlyReportEmail,
      reportDeliveryDate: updated.reportDeliveryDate,
      reportDeliveryTime: updated.reportDeliveryTime,
    };
  }
}
export default ProfileService;

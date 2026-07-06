import { prisma } from '../../../config/prisma.js';

export class ProfileRepository {
  public async getUserWithPreferences(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
      },
    });
  }

  public async updateUser(userId: string, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data,
      include: {
        preferences: true,
      },
    });
  }

  public async upsertPreferences(userId: string, data: any) {
    return prisma.userPreferences.upsert({
      where: { userId },
      create: {
        ...data,
        userId,
      },
      update: data,
    });
  }

  public async getRecentActivities(userId: string) {
    const [transactions, goals, budgets, aiMessages, user] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, type: true, amount: true, description: true, createdAt: true },
      }),
      prisma.goal.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { id: true, name: true, status: true, updatedAt: true },
      }),
      prisma.budget.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { id: true, amount: true, updatedAt: true },
      }),
      prisma.aiMessage.findMany({
        where: { conversation: { userId } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, role: true, toolExecuted: true, createdAt: true },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
    ]);

    const activities: any[] = [];

    if (user) {
      activities.push({
        id: 'user-reg',
        time: user.createdAt,
        action: 'Account Registered',
        module: 'Profile',
        status: 'SUCCESS',
      });
    }

    transactions.forEach((tx) => {
      activities.push({
        id: tx.id,
        time: tx.createdAt,
        action: `Transaction Created: ${tx.type} ₹${tx.amount}`,
        module: 'Transactions',
        status: 'SUCCESS',
      });
    });

    goals.forEach((g) => {
      activities.push({
        id: g.id,
        time: g.updatedAt,
        action: `Goal Updated: ${g.name} (${g.status})`,
        module: 'Goals',
        status: 'SUCCESS',
      });
    });

    budgets.forEach((b) => {
      activities.push({
        id: b.id,
        time: b.updatedAt,
        action: `Budget Configured: limit ₹${b.amount}`,
        module: 'Budgets',
        status: 'SUCCESS',
      });
    });

    aiMessages.forEach((msg) => {
      if (msg.role === 'user') {
        activities.push({
          id: msg.id,
          time: msg.createdAt,
          action: 'Sent message to Assistant',
          module: 'AI Assistant',
          status: 'SUCCESS',
        });
      } else if (msg.toolExecuted) {
        activities.push({
          id: msg.id,
          time: msg.createdAt,
          action: `AI Assistant Tool Run: ${msg.toolExecuted}`,
          module: 'AI Assistant',
          status: 'SUCCESS',
        });
      }
    });

    // Sort by time desc
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return activities.slice(0, 15);
  }
}
export default ProfileRepository;

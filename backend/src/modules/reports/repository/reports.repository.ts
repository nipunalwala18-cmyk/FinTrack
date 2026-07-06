import { prisma } from '../../../config/prisma.js';

export class ReportsRepository {
  public async getReports(userId: string) {
    return prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  public async getReportById(userId: string, id: string) {
    return prisma.report.findFirst({
      where: { id, userId },
    });
  }

  public async createReport(data: any) {
    return prisma.report.create({
      data,
    });
  }

  public async updateReport(id: string, data: any) {
    return prisma.report.update({
      where: { id },
      data,
    });
  }

  public async deleteReport(userId: string, id: string) {
    return prisma.report.deleteMany({
      where: { id, userId },
    });
  }
}
export default ReportsRepository;

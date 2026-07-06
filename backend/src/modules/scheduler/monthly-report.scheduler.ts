import cron from 'node-cron';
import { prisma } from '../../config/prisma.js';
import { ReportsService } from '../reports/service/reports.service.js';

const reportsService = new ReportsService();

export const initMonthlyReportScheduler = () => {
  console.log('⏰ Initializing Monthly Email Report Scheduler...');

  // Run every hour to check if any user needs their scheduled report sent
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const currentDay = now.getDate();
      const currentHourStr = now.getHours().toString().padStart(2, '0');
      const currentMinuteStr = now.getMinutes().toString().padStart(2, '0');
      const currentMonth = now.getMonth() + 1; // 1-indexed
      const currentYear = now.getFullYear();

      // Find all users with monthly reports enabled
      const userPrefs = await prisma.userPreferences.findMany({
        where: {
          monthlyReportEnabled: true,
        },
      });

      console.log(`⏰ Scheduler running: checking ${userPrefs.length} user schedules...`);

      for (const pref of userPrefs) {
        const deliveryDay = pref.reportDeliveryDate || 1;
        
        // Split time (e.g. "09:00")
        const [targetHour, targetMinute] = (pref.reportDeliveryTime || '09:00').split(':');

        // Check if today matches the scheduled delivery day
        if (currentDay === deliveryDay && currentHourStr === targetHour) {
          // Verify if a report was already generated for this month/year to prevent duplicate runs
          const existing = await prisma.report.findFirst({
            where: {
              userId: pref.userId,
              type: 'MONTHLY',
              month: currentMonth,
              year: currentYear,
            },
          });

          if (!existing) {
            console.log(`⏰ Scheduler: Generating monthly report for userId: ${pref.userId}...`);
            const report = await reportsService.generateReport(pref.userId, 'MONTHLY', currentMonth, currentYear, 'SYSTEM');
            console.log(`⏰ Scheduler: Emailing report ID: ${report.id} to user...`);
            await reportsService.emailReport(pref.userId, report.id);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in Monthly Report Scheduler:', error);
    }
  });
};

import { api } from '../api/axios';
import type { ApiResponse } from '../features/auth/types/auth.types';

export interface ReportItem {
  id: string;
  userId: string;
  type: string;
  month: number;
  year: number;
  fileName: string;
  format: string;
  storagePath: string;
  generatedAt: string;
  generatedBy: string;
  emailed: boolean;
  emailedAt: string | null;
  createdAt: string;
}

export const reportsService = {
  getReports: async (): Promise<ReportItem[]> => {
    const response = await api.get<ApiResponse<ReportItem[]>>('/reports');
    return response.data.data;
  },

  getReportById: async (id: string): Promise<ReportItem> => {
    const response = await api.get<ApiResponse<ReportItem>>(`/reports/${id}`);
    return response.data.data;
  },

  generateReport: async (type: string, month: number, year: number): Promise<ReportItem> => {
    const response = await api.post<ApiResponse<ReportItem>>('/reports/generate', { type, month, year });
    return response.data.data;
  },

  downloadReport: async (id: string): Promise<{ fileName: string; content: string }> => {
    const response = await api.post<ApiResponse<{ fileName: string; content: string }>>('/reports/download', { id });
    return response.data.data;
  },

  emailReport: async (id: string): Promise<{ success: boolean; emailedTo: string }> => {
    const response = await api.post<ApiResponse<{ success: boolean; emailedTo: string }>>('/reports/email', { id });
    return response.data.data;
  },

  deleteReport: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<ApiResponse<{ success: boolean }>>(`/reports/${id}`);
    return response.data.data;
  },
};
export default reportsService;

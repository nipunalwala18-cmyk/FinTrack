import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';
import type { ReportItem } from '../services/reports.service';
import { toast } from 'react-hot-toast';

export const useReports = () => {
  return useQuery<ReportItem[], Error>({
    queryKey: ['reports'],
    queryFn: reportsService.getReports,
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation<ReportItem, Error, { type: string; month: number; year: number }>({
    mutationFn: ({ type, month, year }) => reportsService.generateReport(type, month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report generated successfully');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to generate report';
      toast.error(msg);
    },
  });
};

export const useDownloadReport = () => {
  return useMutation<{ fileName: string; content: string }, Error, string>({
    mutationFn: (id) => reportsService.downloadReport(id),
    onSuccess: (data) => {
      // Create text blob download
      const element = document.createElement('a');
      const file = new Blob([data.content], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = data.fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Report downloaded successfully');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to download report';
      toast.error(msg);
    },
  });
};

export const useEmailReport = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; emailedTo: string }, Error, string>({
    mutationFn: (id) => reportsService.emailReport(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success(`Report emailed to ${data.emailedTo} successfully`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to email report';
      toast.error(msg);
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => reportsService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report deleted successfully');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to delete report';
      toast.error(msg);
    },
  });
};

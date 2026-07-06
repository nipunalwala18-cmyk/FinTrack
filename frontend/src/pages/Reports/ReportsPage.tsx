import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Sparkles,
  Download,
  Mail,
  Trash2,
  AlertCircle,
  PlusCircle,
  Clock,
  Filter,
  Eye,
  CheckCircle,
  Loader2
} from 'lucide-react';
import {
  useReports,
  useGenerateReport,
  useDownloadReport,
  useEmailReport,
  useDeleteReport
} from '../../hooks/useReports';

export const ReportsPage: React.FC = () => {
  const { data: reports = [], isLoading } = useReports();
  const generateReport = useGenerateReport();
  const downloadReport = useDownloadReport();
  const emailReport = useEmailReport();
  const deleteReport = useDeleteReport();

  // Filters State
  const [filterMonth, setFilterMonth] = useState('ALL');
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  // Generator State
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [genType, setGenType] = useState('MONTHLY');

  // Preview State
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateReport.mutate({
      type: genType,
      month: Number(genMonth),
      year: Number(genYear),
    });
  };

  const handlePreview = async (reportId: string, title: string) => {
    try {
      const data = await downloadReport.mutateAsync(reportId);
      setPreviewContent(data.content);
      setPreviewTitle(title);
    } catch (err) {
      // Handled by hook
    }
  };

  // Filter logic
  const filteredReports = reports.filter((r) => {
    if (filterMonth !== 'ALL' && r.month !== Number(filterMonth)) return false;
    if (filterYear !== 'ALL' && r.year !== Number(filterYear)) return false;
    if (filterType !== 'ALL' && r.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6 w-full text-left animate-fade-in font-sans pb-12">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Financial reports</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Generate, download, and email monthly or yearly financial reports with AI coaching summaries.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Generator & Filters */}
        <div className="lg:col-span-4 space-y-6">
          {/* Generator Card */}
          <div className="rounded-3xl border border-gray-150 bg-white p-6 dark:border-gray-800 dark:bg-[#12131a] space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Generate Report</h3>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Report Type</label>
                <select
                  value={genType}
                  onChange={(e) => setGenType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                >
                  <option value="MONTHLY">Monthly Financial Report</option>
                  <option value="YEARLY">Yearly Financial Report</option>
                  <option value="BUDGET">Budget Performance</option>
                  <option value="GOAL">Goal Progress Report</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Month</label>
                  <select
                    value={genMonth}
                    onChange={(e) => setGenMonth(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Year</label>
                  <select
                    value={genYear}
                    onChange={(e) => setGenYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  >
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={generateReport.isPending}
                className="w-full rounded-xl bg-purple-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {generateReport.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing Financials...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4.5 w-4.5" />
                    <span>Compile Report</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* History Filters */}
          <div className="rounded-3xl border border-gray-150 bg-white p-6 dark:border-gray-800 dark:bg-[#12131a] space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Filter History</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Report Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                >
                  <option value="ALL">All Types</option>
                  <option value="MONTHLY">Monthly Financial Report</option>
                  <option value="YEARLY">Yearly Financial Report</option>
                  <option value="BUDGET">Budget Performance</option>
                  <option value="GOAL">Goal Progress Report</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Month</label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                >
                  <option value="ALL">All Months</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Report History List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-gray-150 bg-white p-6 dark:border-gray-800 dark:bg-[#12131a] space-y-4">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Report History</h3>

            {isLoading ? (
              <div className="flex py-12 justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <FileText className="h-10 w-10 mb-2 stroke-1" />
                <p className="text-xs">No reports compiled yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase">Report Date</th>
                      <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase">Type</th>
                      <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase">Emailed</th>
                      <th className="py-3 px-4 font-bold text-gray-400 text-xs uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-900/10"
                      >
                        <td className="py-4 px-4 font-bold text-gray-850 dark:text-white">
                          {months.find((m) => m.value === report.month)?.label} {report.year}
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-gray-500">
                          {report.type}
                        </td>
                        <td className="py-4 px-4 text-xs">
                          {report.emailed ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="h-3 w-3" /> Yes
                            </span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right space-x-1">
                          <button
                            onClick={() => handlePreview(report.id, `${report.type} - ${report.month}/${report.year}`)}
                            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            title="Preview Report"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadReport.mutate(report.id)}
                            disabled={downloadReport.isPending}
                            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/20"
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => emailReport.mutate(report.id)}
                            disabled={emailReport.isPending}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20"
                            title="Email Report"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteReport.mutate(report.id)}
                            disabled={deleteReport.isPending}
                            className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            title="Delete Report"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewContent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#12131a] rounded-3xl border border-gray-150 dark:border-gray-800 max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="font-extrabold text-gray-900 dark:text-white">{previewTitle}</h3>
              <button
                onClick={() => setPreviewContent(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-2xl dark:bg-gray-950 border border-gray-100 dark:border-gray-900 text-xs font-mono whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
              {previewContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

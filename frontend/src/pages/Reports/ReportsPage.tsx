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
  Loader2,
  X
} from 'lucide-react';
import {
  useReports,
  useGenerateReport,
  useDownloadReport,
  useEmailReport,
  useDeleteReport
} from '../../hooks/useReports';
import { ConfirmationDialog } from '../../components/layout/ConfirmationDialog';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE
} from '../../components/accounts/fieldStyles';

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

  // Confirmation dialog state
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);

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

  const handleDeleteClick = (id: string) => {
    setDeleteReportId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteReportId) {
      deleteReport.mutate(deleteReportId, {
        onSuccess: () => {
          setDeleteReportId(null);
        },
      });
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterMonth !== 'ALL' && r.month !== Number(filterMonth)) return false;
    if (filterYear !== 'ALL' && r.year !== Number(filterYear)) return false;
    if (filterType !== 'ALL' && r.type !== filterType) return false;
    return true;
  });

  // Overview stats calculation
  const totalReports = reports.length;
  const monthlyReports = reports.filter((r) => r.type === 'MONTHLY').length;
  const yearlyReports = reports.filter((r) => r.type === 'YEARLY').length;
  const budgetReports = reports.filter((r) => r.type === 'BUDGET').length;

  return (
    <div className="space-y-5 w-full text-left animate-fade-in font-sans pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Financial Reports</h1>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Generate, download, and email monthly or yearly financial reports with AI coaching summaries.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Total Reports</span>
            <p className="text-2xl font-semibold text-white">{totalReports}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white border border-white/10">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Monthly</span>
            <p className="text-2xl font-semibold text-purple-400">{monthlyReports}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Yearly</span>
            <p className="text-2xl font-semibold text-emerald-400">{yearlyReports}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Budget Reports</span>
            <p className="text-2xl font-semibold text-blue-400">{budgetReports}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 pt-2">
        {/* Left Side: Generator & Filters */}
        <div className="lg:col-span-4 space-y-6">
          {/* Generator Card */}
          <div
            className="p-6 space-y-5"
            style={{
              background: '#0a0a0a',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-white" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Generate Report</h3>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label className={LABEL_CLS} style={LABEL_STYLE}>Report Type</label>
                <select
                  value={genType}
                  onChange={(e) => setGenType(e.target.value)}
                  className={`${INPUT_BASE} appearance-none cursor-pointer`}
                  style={INPUT_STYLE}
                  onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                  onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                >
                  <option value="MONTHLY" style={{ background: '#141414' }}>Monthly Financial Report</option>
                  <option value="YEARLY" style={{ background: '#141414' }}>Yearly Financial Report</option>
                  <option value="BUDGET" style={{ background: '#141414' }}>Budget Performance</option>
                  <option value="GOAL" style={{ background: '#141414' }}>Goal Progress Report</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Month</label>
                  <select
                    value={genMonth}
                    onChange={(e) => setGenMonth(Number(e.target.value))}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value} style={{ background: '#141414' }}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Year</label>
                  <select
                    value={genYear}
                    onChange={(e) => setGenYear(Number(e.target.value))}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value={2026} style={{ background: '#141414' }}>2026</option>
                    <option value={2027} style={{ background: '#141414' }}>2027</option>
                    <option value={2028} style={{ background: '#141414' }}>2028</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={generateReport.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] py-3 text-sm font-semibold text-black transition-all cursor-pointer disabled:opacity-50"
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
          <div
            className="p-6 space-y-5"
            style={{
              background: '#0a0a0a',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
            }}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4.5 w-4.5 text-white/40" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Filter History</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className={LABEL_CLS} style={LABEL_STYLE}>Report Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`${INPUT_BASE} appearance-none cursor-pointer`}
                  style={INPUT_STYLE}
                  onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                  onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                >
                  <option value="ALL" style={{ background: '#141414' }}>All Types</option>
                  <option value="MONTHLY" style={{ background: '#141414' }}>Monthly Financial Report</option>
                  <option value="YEARLY" style={{ background: '#141414' }}>Yearly Financial Report</option>
                  <option value="BUDGET" style={{ background: '#141414' }}>Budget Performance</option>
                  <option value="GOAL" style={{ background: '#141414' }}>Goal Progress Report</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={LABEL_CLS} style={LABEL_STYLE}>Month</label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className={`${INPUT_BASE} appearance-none cursor-pointer`}
                  style={INPUT_STYLE}
                  onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                  onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                >
                  <option value="ALL" style={{ background: '#141414' }}>All Months</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value} style={{ background: '#141414' }}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Report History List */}
        <div className="lg:col-span-8">
          <div
            className="p-6 space-y-4"
            style={{
              background: '#0a0a0a',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 24,
            }}
          >
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Report History</h3>

            {isLoading ? (
              <div className="flex py-12 justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-white/40 space-y-3">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <FileText className="h-7 w-7 text-white/60" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider">No reports compiled yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <th className="py-3 px-4 font-semibold text-white/40 text-[10px] uppercase tracking-wider">Report Date</th>
                      <th className="py-3 px-4 font-semibold text-white/40 text-[10px] uppercase tracking-wider">Type</th>
                      <th className="py-3 px-4 font-semibold text-white/40 text-[10px] uppercase tracking-wider">Emailed</th>
                      <th className="py-3 px-4 font-semibold text-white/40 text-[10px] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b transition-colors"
                        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                      >
                        <td className="py-4 px-4 font-bold text-white">
                          {months.find((m) => m.value === report.month)?.label} {report.year}
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                          {report.type}
                        </td>
                        <td className="py-4 px-4 text-xs">
                          {report.emailed ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                              <CheckCircle className="h-3.5 w-3.5" /> Yes
                            </span>
                          ) : (
                            <span className="text-white/40 font-semibold">No</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right space-x-1 shrink-0">
                          <button
                            onClick={() => handlePreview(report.id, `${report.type} - ${report.month}/${report.year}`)}
                            className="p-1.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-all active:scale-95 cursor-pointer"
                            title="Preview Report"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadReport.mutate(report.id)}
                            disabled={downloadReport.isPending}
                            className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-all active:scale-95 cursor-pointer"
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => emailReport.mutate(report.id)}
                            disabled={emailReport.isPending}
                            className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-all active:scale-95 cursor-pointer"
                            title="Email Report"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(report.id)}
                            disabled={deleteReport.isPending}
                            className="p-1.5 rounded-lg text-rose-450 hover:bg-rose-500/10 transition-all active:scale-95 cursor-pointer"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div
            className="max-w-4xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in"
            style={{
              background: '#0a0a0a',
              border: '0.5px solid rgba(255,255,255,0.14)',
              borderRadius: 20,
            }}
          >
            <div className="flex items-center justify-between pb-3 shrink-0" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
              <h3 className="font-bold text-white text-base">{previewTitle}</h3>
              <button
                onClick={() => setPreviewContent(null)}
                className="rounded-xl p-2 transition-all cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div
              className="flex-1 overflow-y-auto p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed text-white/70 scrollbar-hidden"
              style={{
                background: 'rgba(255,255,255,0.01)',
                border: '0.5px solid rgba(255,255,255,0.08)',
              }}
            >
              {previewContent}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteReportId}
        title="Delete Report"
        description="Are you sure you want to delete this report? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isPending={deleteReport.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteReportId(null)}
      />
    </div>
  );
};

export default ReportsPage;

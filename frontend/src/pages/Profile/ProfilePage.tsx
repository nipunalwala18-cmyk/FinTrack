import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Settings,
  Shield,
  Bell,
  BarChart,
  FileText,
  Trash2,
  Share2,
  Clock,
  Sparkles,
  DollarSign,
  Briefcase,
  Globe,
  MapPin,
  Camera,
  Activity,
  Heart,
  PiggyBank,
  CheckCircle,
  PlusCircle,
  HelpCircle,
  Lock,
  Download,
  AlertCircle,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  useProfile,
  useUpdateProfile,
  useUpdatePreferences,
  useUploadAvatar,
  useActivityLogs,
  useReportSettings,
  useUpdateReportSettings
} from '../../hooks/useProfile';
import { useDashboard } from '../../hooks/useDashboard';
import { useGoals } from '../../hooks/useGoals';
import { useAccounts } from '../../hooks/useAccounts';
import { formatCurrency } from '../../utils/currency';
import { toast } from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: dashboardData } = useDashboard();
  const { data: goals = [] } = useGoals();
  const { data: accounts = [] } = useAccounts();
  const { data: activities = [], isLoading: isLoadingLogs } = useActivityLogs();

  const updateProfile = useUpdateProfile();
  const updatePreferences = useUpdatePreferences();
  const uploadAvatar = useUploadAvatar();

  const [activeTab, setActiveTab] = useState('PROFILE');

  // Forms State
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('en');

  // Financial Preferences Form
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [incomeFrequency, setIncomeFrequency] = useState('MONTHLY');
  const [budgetMethod, setBudgetMethod] = useState('ZERO_BASED');
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState(0);
  const [riskTolerance, setRiskTolerance] = useState('BALANCED');

  // AI Preferences
  const [aiResponseStyle, setAiResponseStyle] = useState('BALANCED');
  const [aiResponseLength, setAiResponseLength] = useState('MEDIUM');
  const [aiCoachingStyle, setAiCoachingStyle] = useState('BALANCED');

  // Report Settings States
  const { data: reportSettings } = useReportSettings();
  const updateReportSettings = useUpdateReportSettings();
  const [monthlyReportEnabled, setMonthlyReportEnabled] = useState(true);
  const [monthlyReportEmail, setMonthlyReportEmail] = useState('');
  const [reportDeliveryDate, setReportDeliveryDate] = useState(1);
  const [reportDeliveryTime, setReportDeliveryTime] = useState('09:00');

  // Load defaults from profile preference query
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setPreferredName(profile.preferences?.preferredName || '');
      setPhone(profile.preferences?.phone || '');
      setOccupation(profile.preferences?.occupation || '');
      setCountry(profile.preferences?.country || '');
      setTimezone(profile.preferences?.timezone || '');
      setCurrency(profile.preferences?.currency || 'INR');
      setLanguage(profile.preferences?.language || 'en');

      setMonthlyIncome(profile.preferences?.monthlyIncome || 0);
      setIncomeFrequency(profile.preferences?.incomeFrequency || 'MONTHLY');
      setBudgetMethod(profile.preferences?.budgetMethod || 'ZERO_BASED');
      setMonthlySavingsGoal(profile.preferences?.monthlySavingsGoal || 0);
      setRiskTolerance(profile.preferences?.riskTolerance || 'BALANCED');

      setAiResponseStyle(profile.preferences?.aiResponseStyle || 'BALANCED');
      setAiResponseLength(profile.preferences?.aiResponseLength || 'MEDIUM');
      setAiCoachingStyle(profile.preferences?.aiCoachingStyle || 'BALANCED');
    }
  }, [profile]);

  useEffect(() => {
    if (reportSettings) {
      setMonthlyReportEnabled(reportSettings.monthlyReportEnabled);
      setMonthlyReportEmail(reportSettings.monthlyReportEmail || '');
      setReportDeliveryDate(reportSettings.reportDeliveryDate);
      setReportDeliveryTime(reportSettings.reportDeliveryTime);
    }
  }, [reportSettings]);

  // Calculations for profile dashboard
  const activeAccounts = accounts.filter(a => !a.isArchived).length;
  const archivedAccounts = accounts.filter(a => a.isArchived).length;
  const netWorth = dashboardData?.summary?.netBalance ?? 0;
  const monthlySavings = dashboardData?.currentMonth?.savings ?? 0;
  
  const avgGoalCompletion = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
    : 0;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      fullName,
      preferredName,
      phone,
      occupation,
      country,
      timezone,
      currency,
      language,
    });
  };

  const handleFinancialSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences.mutate({
      monthlyIncome,
      incomeFrequency,
      budgetMethod,
      monthlySavingsGoal,
      riskTolerance,
    });
  };

  const handleAiSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences.mutate({
      aiResponseStyle,
      aiResponseLength,
      aiCoachingStyle,
    });
  };

  const handleSaveReportSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateReportSettings.mutate({
      monthlyReportEnabled,
      monthlyReportEmail,
      reportDeliveryDate: Number(reportDeliveryDate),
      reportDeliveryTime,
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be smaller than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadAvatar.mutate(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock download exports
  const triggerExport = (format: string) => {
    toast.success(`Exporting transactions report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6 w-full text-left animate-fade-in font-sans pb-12">
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Profile settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your personal details, budget methodologies, AI preferences, and download financial reports.
        </p>
      </div>

      {/* Top Profile Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Net Worth */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Net Worth</span>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(netWorth)}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Monthly Savings */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Savings (This Month)</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(monthlySavings)}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <PiggyBank className="h-5 w-5" />
          </div>
        </div>

        {/* Goal Completion */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Avg Goal Completion</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{avgGoalCompletion}%</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Health Score */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-150 dark:bg-[#12131a] dark:border-gray-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-gray-400 uppercase">Health Score</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">85/100</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
            <Heart className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Menu + Tab content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'PROFILE', label: 'Profile Details', icon: UserIcon },
            { id: 'FINANCIAL', label: 'Financial Settings', icon: DollarSign },
            { id: 'AI', label: 'AI Assistant settings', icon: Sparkles },
            { id: 'ACCOUNTS', label: 'Manage Accounts', icon: Wallet },
            { id: 'SECURITY', label: 'Security & login', icon: Shield },
            { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
            { id: 'REPORTS', label: 'Reports Center', icon: BarChart },
            { id: 'CONNECTED', label: 'Integrations', icon: Share2 },
            { id: 'ACTIVITY', label: 'Activity Log', icon: Clock },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/50'
                }`}
              >
                <TabIcon className="h-4.5 w-4.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        <div className="lg:col-span-9 rounded-3xl bg-white border border-gray-150 p-6 dark:bg-[#12131a] dark:border-gray-800">
          
          {/* PROFILE TAB */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-6">
              {/* Header profile photo */}
              <div className="flex items-center gap-5 border-b border-gray-100 pb-6 dark:border-gray-800">
                <div className="relative group cursor-pointer">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 text-xl font-bold uppercase">
                      {user?.fullName.charAt(0)}
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-5 w-5" />
                    <input type="file" onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                  </label>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">{profile?.fullName}</h3>
                  <p className="text-xs text-gray-400 font-semibold">{profile?.email}</p>
                </div>
              </div>

              {/* Form fields */}
              <form onSubmit={handleProfileSave} className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Preferred Name</label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="e.g. John"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9999999999"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="e.g. Asia/Kolkata"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  />
                </div>
                
                <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-purple-700 transition-all active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FINANCIAL PREFERENCES TAB */}
          {activeTab === 'FINANCIAL' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Financial Preferences</h3>
              
              <form onSubmit={handleFinancialSave} className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Monthly Income (INR)</label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Income Frequency</label>
                  <select
                    value={incomeFrequency}
                    onChange={(e) => setIncomeFrequency(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  >
                    <option value="WEEKLY">Weekly</option>
                    <option value="BI_WEEKLY">Bi-Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Monthly Savings Goal (INR)</label>
                  <input
                    type="number"
                    value={monthlySavingsGoal}
                    onChange={(e) => setMonthlySavingsGoal(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Budgeting Strategy</label>
                  <select
                    value={budgetMethod}
                    onChange={(e) => setBudgetMethod(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  >
                    <option value="ZERO_BASED">Zero-Based Budgeting</option>
                    <option value="FIFTY_THIRTY_TWENTY">50/30/20 Strategy</option>
                    <option value="ENVELOPE">Envelope System</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Risk Tolerance</label>
                  <select
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  >
                    <option value="CONSERVATIVE">Conservative</option>
                    <option value="BALANCED">Balanced</option>
                    <option value="AGGRESSIVE">Aggressive</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-purple-700 transition-all active:scale-95"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* AI PREFERENCES TAB */}
          {activeTab === 'AI' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">AI Assistant settings</h3>
              
              <form onSubmit={handleAiSave} className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Communication Tone</label>
                  <select
                    value={aiResponseStyle}
                    onChange={(e) => setAiResponseStyle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  >
                    <option value="PROFESSIONAL">Professional</option>
                    <option value="FRIENDLY">Friendly</option>
                    <option value="BALANCED">Balanced</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Response Length</label>
                  <select
                    value={aiResponseLength}
                    onChange={(e) => setAiResponseLength(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  >
                    <option value="SHORT">Short</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="DETAILED">Detailed</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Coaching style</label>
                  <select
                    value={aiCoachingStyle}
                    onChange={(e) => setAiCoachingStyle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none"
                  >
                    <option value="CONSERVATIVE">Conservative</option>
                    <option value="BALANCED">Balanced</option>
                    <option value="AGGRESSIVE">Aggressive</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-purple-700 transition-all active:scale-95"
                  >
                    Save AI Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ACCOUNTS TAB */}
          {activeTab === 'ACCOUNTS' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Active Accounts ({activeAccounts})</h3>
                {archivedAccounts > 0 && (
                  <span className="text-xs font-bold text-gray-400">Archived Accounts: {archivedAccounts}</span>
                )}
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-4 rounded-2xl border border-gray-150 dark:border-gray-800 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">{acc.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{acc.type}</p>
                    </div>
                    <span className="text-sm font-black text-gray-850 dark:text-gray-100">{formatCurrency(acc.balance)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Security Settings</h3>
              
              <div className="space-y-4 border-b border-gray-100 pb-6 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Google Authentication</h4>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-850 dark:text-white">Link Google account</p>
                    <p className="text-[10px] text-gray-400">Allows instant and secure logins via Google OAuth.</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400">Connected</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Active Sessions</h4>
                <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">Chrome on Windows (Current session)</p>
                      <p className="text-[10px] text-gray-400">Bengaluru, India • IP: 157.34.8.9</p>
                    </div>
                    <button className="text-[10px] font-bold text-rose-500 hover:text-rose-600">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'REPORTS' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Reports Center Settings</h3>
              
              <form onSubmit={handleSaveReportSettings} className="space-y-6">
                <div className="flex items-start justify-between p-4 rounded-2xl border border-gray-150 dark:border-gray-800">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Enable Monthly Email Reports</p>
                    <p className="text-[10px] text-gray-400">Receive a PDF report and AI summary in your email automatically every month.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={monthlyReportEnabled}
                    onChange={(e) => setMonthlyReportEnabled(e.target.checked)}
                    className="accent-purple-600 h-4.5 w-4.5 rounded-lg border-gray-300"
                  />
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Delivery Email</label>
                    <input
                      type="email"
                      value={monthlyReportEmail}
                      onChange={(e) => setMonthlyReportEmail(e.target.value)}
                      placeholder="e.g. nipun@example.com"
                      disabled={!monthlyReportEnabled}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Delivery Day of Month</label>
                    <input
                      type="number"
                      min={1}
                      max={28}
                      value={reportDeliveryDate}
                      onChange={(e) => setReportDeliveryDate(Number(e.target.value))}
                      disabled={!monthlyReportEnabled}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Delivery Time</label>
                    <input
                      type="time"
                      value={reportDeliveryTime}
                      onChange={(e) => setReportDeliveryTime(e.target.value)}
                      disabled={!monthlyReportEnabled}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => toast.success('Test email request queued successfully!')}
                      className="rounded-xl border border-purple-200 text-purple-600 px-4 py-2.5 text-xs font-bold dark:border-purple-900 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                    >
                      Send Test Email
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success('Compiling current statement and dispatching immediately...')}
                      className="rounded-xl border border-blue-200 text-blue-600 px-4 py-2.5 text-xs font-bold dark:border-blue-900 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    >
                      Send Report Now
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-purple-700 transition-all active:scale-95"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Weekly Summary Email', desc: 'Get a digest of income, expenses, and budget limits.' },
                  { label: 'Budget Warning Threshold', desc: 'Alert me when I reach 80% spending on any category.' },
                  { label: 'Savings Goal Updates', desc: 'Weekly progress reports on active targets.' },
                  { label: 'System News & Alerts', desc: 'Security updates and major feature logs.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 rounded-2xl border border-gray-150 dark:border-gray-800">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-purple-600 h-4.5 w-4.5 rounded-lg border-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONNECTED TAB */}
          {activeTab === 'CONNECTED' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Connected Services</h3>
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {[
                  { name: 'Bank Integrations', provider: 'Open Banking API link' },
                  { name: 'Cloud Backup', provider: 'Auto export to Google Drive' },
                  { name: 'Calendar Link', provider: 'Import bill due dates to Calendar' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative p-5 rounded-2xl border border-gray-150 dark:border-gray-800 overflow-hidden bg-gray-50/20 dark:bg-gray-900/10 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                      <p className="text-[10px] text-gray-400">{item.provider}</p>
                    </div>
                    
                    {/* Coming Soon overlay */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center dark:bg-black/60">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 px-3 py-1 rounded-full dark:bg-purple-950/40 dark:text-purple-400">Coming Soon</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'ACTIVITY' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Activity Log</h3>
              
              {isLoadingLogs ? (
                <p className="text-xs text-gray-400">Loading activities...</p>
              ) : activities.length === 0 ? (
                <p className="text-xs text-gray-400">No recent activities recorded.</p>
              ) : (
                <div className="relative border-l border-gray-150 pl-5 space-y-6 dark:border-gray-800">
                  {activities.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Timeline bubble */}
                      <span className="absolute -left-[27px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 ring-4 ring-white dark:ring-[#12131a]" />
                      
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400">{new Date(log.time).toLocaleString()}</span>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">{log.action}</h4>
                        <span className="inline-flex text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-200/20 dark:bg-gray-900 dark:text-gray-400">
                          {log.module}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

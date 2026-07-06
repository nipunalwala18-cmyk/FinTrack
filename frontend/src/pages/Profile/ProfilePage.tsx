import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Shield,
  Bell,
  BarChart,
  Share2,
  Clock,
  Sparkles,
  DollarSign,
  Camera,
  Heart,
  PiggyBank,
  CheckCircle,
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
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE
} from '../../components/accounts/fieldStyles';

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

  return (
    <div className="space-y-5 w-full text-left animate-fade-in font-sans pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Manage your personal details, budget methodologies, AI preferences, and download financial reports.
          </p>
        </div>
      </div>

      {/* Top Profile Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Net Worth */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Net Worth</span>
            <p className="text-2xl font-semibold text-white">{formatCurrency(netWorth)}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white border border-white/10">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Monthly Savings */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Savings (This Month)</span>
            <p className="text-2xl font-semibold text-emerald-400">{formatCurrency(monthlySavings)}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PiggyBank className="h-5 w-5" />
          </div>
        </div>

        {/* Goal Completion */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Avg Goal Completion</span>
            <p className="text-2xl font-semibold text-blue-400">{avgGoalCompletion}%</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Health Score */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
          }}
        >
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">Health Score</span>
            <p className="text-2xl font-semibold text-purple-400">85/100</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Heart className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Menu + Tab content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 pt-2">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1.5">
          {[
            { id: 'PROFILE', label: 'Profile Details', icon: UserIcon },
            { id: 'FINANCIAL', label: 'Financial Settings', icon: DollarSign },
            { id: 'AI', label: 'AI Assistant Settings', icon: Sparkles },
            { id: 'ACCOUNTS', label: 'Manage Accounts', icon: Wallet },
            { id: 'SECURITY', label: 'Security & Login', icon: Shield },
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
                className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-xs font-semibold transition-all cursor-pointer"
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: '0.5px solid',
                  borderColor: isSelected ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
                }}
              >
                <TabIcon className="h-4.5 w-4.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        <div
          className="lg:col-span-9 p-6 text-left"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
          }}
        >
          
          {/* PROFILE TAB */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-6">
              {/* Header profile photo */}
              <div className="flex items-center gap-5 pb-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="relative group cursor-pointer">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-white border border-white/10 text-xl font-bold uppercase">
                      {user?.fullName.charAt(0)}
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-5 w-5" />
                    <input type="file" onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                  </label>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{profile?.fullName}</h3>
                  <p className="text-xs text-white/40 font-semibold">{profile?.email}</p>
                </div>
              </div>

              {/* Form fields */}
              <form onSubmit={handleProfileSave} className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={INPUT_BASE}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Preferred Name</label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="e.g. John"
                    className={INPUT_BASE}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9999999999"
                    className={INPUT_BASE}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className={INPUT_BASE}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className={INPUT_BASE}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="e.g. Asia/Kolkata"
                    className={INPUT_BASE}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  />
                </div>
                
                <div className="md:col-span-2 pt-4 border-t flex justify-end" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <button
                    type="submit"
                    className="rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] px-6 py-2.5 text-sm font-semibold text-black transition-all cursor-pointer"
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
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Financial Preferences</h3>
              
              <form onSubmit={handleFinancialSave} className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Monthly Income (INR)</label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className={INPUT_BASE}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Income Frequency</label>
                  <select
                    value={incomeFrequency}
                    onChange={(e) => setIncomeFrequency(e.target.value)}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="WEEKLY" style={{ background: '#141414' }}>Weekly</option>
                    <option value="BI_WEEKLY" style={{ background: '#141414' }}>Bi-Weekly</option>
                    <option value="MONTHLY" style={{ background: '#141414' }}>Monthly</option>
                    <option value="YEARLY" style={{ background: '#141414' }}>Yearly</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Monthly Savings Goal (INR)</label>
                  <input
                    type="number"
                    value={monthlySavingsGoal}
                    onChange={(e) => setMonthlySavingsGoal(Number(e.target.value))}
                    className={INPUT_BASE}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Budgeting Strategy</label>
                  <select
                    value={budgetMethod}
                    onChange={(e) => setBudgetMethod(e.target.value)}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="ZERO_BASED" style={{ background: '#141414' }}>Zero-Based Budgeting</option>
                    <option value="FIFTY_THIRTY_TWENTY" style={{ background: '#141414' }}>50/30/20 Strategy</option>
                    <option value="ENVELOPE" style={{ background: '#141414' }}>Envelope System</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Risk Tolerance</label>
                  <select
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="CONSERVATIVE" style={{ background: '#141414' }}>Conservative</option>
                    <option value="BALANCED" style={{ background: '#141414' }}>Balanced</option>
                    <option value="AGGRESSIVE" style={{ background: '#141414' }}>Aggressive</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-4 border-t flex justify-end" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <button
                    type="submit"
                    className="rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] px-6 py-2.5 text-sm font-semibold text-black transition-all cursor-pointer"
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
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">AI Assistant Settings</h3>
              
              <form onSubmit={handleAiSave} className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Communication Tone</label>
                  <select
                    value={aiResponseStyle}
                    onChange={(e) => setAiResponseStyle(e.target.value)}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="PROFESSIONAL" style={{ background: '#141414' }}>Professional</option>
                    <option value="FRIENDLY" style={{ background: '#141414' }}>Friendly</option>
                    <option value="BALANCED" style={{ background: '#141414' }}>Balanced</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Response Length</label>
                  <select
                    value={aiResponseLength}
                    onChange={(e) => setAiResponseLength(e.target.value)}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="SHORT" style={{ background: '#141414' }}>Short</option>
                    <option value="MEDIUM" style={{ background: '#141414' }}>Medium</option>
                    <option value="DETAILED" style={{ background: '#141414' }}>Detailed</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL_CLS} style={LABEL_STYLE}>Coaching Style</label>
                  <select
                    value={aiCoachingStyle}
                    onChange={(e) => setAiCoachingStyle(e.target.value)}
                    className={`${INPUT_BASE} appearance-none cursor-pointer`}
                    style={INPUT_STYLE}
                    onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                    onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                  >
                    <option value="CONSERVATIVE" style={{ background: '#141414' }}>Conservative</option>
                    <option value="BALANCED" style={{ background: '#141414' }}>Balanced</option>
                    <option value="AGGRESSIVE" style={{ background: '#141414' }}>Aggressive</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-4 border-t flex justify-end" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <button
                    type="submit"
                    className="rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] px-6 py-2.5 text-sm font-semibold text-black transition-all cursor-pointer"
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
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Active Accounts ({activeAccounts})</h3>
                {archivedAccounts > 0 && (
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Archived Accounts: {archivedAccounts}</span>
                )}
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-5 flex items-center justify-between"
                    style={{
                      background: '#141414',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                      borderRadius: 16,
                    }}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">{acc.name}</h4>
                      <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">{acc.type}</p>
                    </div>
                    <span className="text-sm font-bold text-white">{formatCurrency(acc.balance)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Security Settings</h3>
              
              <div className="space-y-4 pb-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Google Authentication</h4>
                <div
                  className="p-4 flex items-center justify-between"
                  style={{
                    background: '#141414',
                    border: '0.5px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                  }}
                >
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs font-bold text-white">Link Google account</p>
                    <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Allows instant and secure logins via Google OAuth.</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/25 uppercase tracking-wider">Connected</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Active Sessions</h4>
                <div
                  className="p-4 space-y-3"
                  style={{
                    background: '#141414',
                    border: '0.5px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-left">
                      <p className="font-semibold text-white">Chrome on Windows (Current session)</p>
                      <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Bengaluru, India • IP: 157.34.8.9</p>
                    </div>
                    <button className="text-[10px] font-semibold uppercase tracking-wider text-rose-450 hover:text-rose-600 cursor-pointer">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'REPORTS' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Reports Center Settings</h3>
              
              <form onSubmit={handleSaveReportSettings} className="space-y-6">
                <div
                  className="flex items-start justify-between p-4"
                  style={{
                    background: '#141414',
                    border: '0.5px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                  }}
                >
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs font-bold text-white">Enable Monthly Email Reports</p>
                    <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Receive a PDF report and AI summary in your email automatically every month.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={monthlyReportEnabled}
                    onChange={(e) => setMonthlyReportEnabled(e.target.checked)}
                    className="accent-white h-4.5 w-4.5 rounded-lg border-gray-300 cursor-pointer"
                  />
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 text-left">
                  <div className="space-y-1.5">
                    <label className={LABEL_CLS} style={LABEL_STYLE}>Delivery Email</label>
                    <input
                      type="email"
                      value={monthlyReportEmail}
                      onChange={(e) => setMonthlyReportEmail(e.target.value)}
                      placeholder="e.g. nipun@example.com"
                      disabled={!monthlyReportEnabled}
                      className={INPUT_BASE}
                      style={INPUT_STYLE}
                      onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                      onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL_CLS} style={LABEL_STYLE}>Delivery Day of Month</label>
                    <input
                      type="number"
                      min={1}
                      max={28}
                      value={reportDeliveryDate}
                      onChange={(e) => setReportDeliveryDate(Number(e.target.value))}
                      disabled={!monthlyReportEnabled}
                      className={INPUT_BASE}
                      style={INPUT_STYLE}
                      onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                      onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL_CLS} style={LABEL_STYLE}>Delivery Time</label>
                    <input
                      type="time"
                      value={reportDeliveryTime}
                      onChange={(e) => setReportDeliveryTime(e.target.value)}
                      disabled={!monthlyReportEnabled}
                      className={INPUT_BASE}
                      style={INPUT_STYLE}
                      onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                      onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => toast.success('Test email request queued successfully!')}
                      className="rounded-xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                      style={{
                        background: 'transparent',
                        border: '0.5px solid rgba(255,255,255,0.18)',
                        color: '#fff',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Send Test Email
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success('Compiling statement and dispatching immediately...')}
                      className="rounded-xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                      style={{
                        background: 'transparent',
                        border: '0.5px solid rgba(255,255,255,0.18)',
                        color: '#fff',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Send Report Now
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] px-6 py-2.5 text-sm font-semibold text-black transition-all cursor-pointer"
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
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Weekly Summary Email', desc: 'Get a digest of income, expenses, and budget limits.' },
                  { label: 'Budget Warning Threshold', desc: 'Alert me when I reach 80% spending on any category.' },
                  { label: 'Savings Goal Updates', desc: 'Weekly progress reports on active targets.' },
                  { label: 'System News & Alerts', desc: 'Security updates and major feature logs.' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-4"
                    style={{
                      background: '#141414',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                      borderRadius: 16,
                    }}
                  >
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-white h-4.5 w-4.5 rounded-lg cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONNECTED TAB */}
          {activeTab === 'CONNECTED' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Connected Services</h3>
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {[
                  { name: 'Bank Integrations', provider: 'Open Banking API link' },
                  { name: 'Cloud Backup', provider: 'Auto export to Google Drive' },
                  { name: 'Calendar Link', provider: 'Import bill due dates to Calendar' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative p-5 overflow-hidden flex flex-col justify-between"
                    style={{
                      background: '#141414',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                      borderRadius: 16,
                    }}
                  >
                    <div className="space-y-1 text-left">
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">{item.provider}</p>
                    </div>
                    
                    {/* Coming Soon overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">Coming Soon</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'ACTIVITY' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Activity Log</h3>
              
              {isLoadingLogs ? (
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">Loading activities...</p>
              ) : activities.length === 0 ? (
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">No recent activities recorded.</p>
              ) : (
                <div className="relative border-l pl-5 space-y-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {activities.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Timeline bubble */}
                      <span className="absolute -left-[27px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-white ring-4 ring-black" />
                      
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">{new Date(log.time).toLocaleString()}</span>
                        <h4 className="text-xs font-semibold text-white">{log.action}</h4>
                        <span
                          className="inline-flex text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            borderColor: 'rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.6)',
                          }}
                        >
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

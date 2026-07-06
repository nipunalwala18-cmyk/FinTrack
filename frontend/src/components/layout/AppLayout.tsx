import React, { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Header } from './Header';
import { Loader2 } from 'lucide-react';
import { FloatingChatWidget } from '../ai/FloatingChatWidget';

export const AppLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-[#0b0c10] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* 1. Desktop Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* 2. Mobile Drawer Navigation Overlay */}
      <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      {/* 3. Main content frame */}
      <div className="flex flex-col flex-grow min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onMenuClick={() => setIsMobileOpen(true)} />

        {/* Scrollable page body */}
        <main className="flex-grow overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl w-full">
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Persistent Floating Chat Widget */}
      <FloatingChatWidget />
    </div>
  );
};
export default AppLayout;

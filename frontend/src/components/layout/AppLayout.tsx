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
    <div className="flex min-h-screen w-screen text-white bg-black">
      {/* 1. Desktop Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* 2. Mobile Drawer Navigation Overlay */}
      <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      {/* 3. Main content frame */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* Top Header */}
        <Header onMenuClick={() => setIsMobileOpen(true)} />

        {/* Scrollable page body container */}
        <main className="flex-grow px-6 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl w-full">
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'rgba(255,255,255,0.5)' }} />
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

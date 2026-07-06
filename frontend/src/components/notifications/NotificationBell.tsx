import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { NotificationBadge } from './NotificationBadge';
import type { NotificationData } from './NotificationItem';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([
    {
      id: '1',
      type: 'BUDGET',
      title: 'Budget Warning',
      message: 'You have spent 85% of your Food budget limit.',
      time: '2 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'GOAL',
      title: 'Goal Contribution',
      message: '₹2,000 contributed to Emergency Fund.',
      time: '15 min ago',
      read: false,
    },
    {
      id: '3',
      type: 'REPORT',
      title: 'Monthly Report Ready',
      message: 'Your report for 06/2026 has been generated.',
      time: 'Today',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl p-2.5 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
        style={{ color: 'rgba(255,255,255,0.55)' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <NotificationBadge count={unreadCount} />
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
export default NotificationBell;

import React, { useEffect, useRef } from 'react';
import { CheckCheck } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { NotificationEmptyState } from './NotificationEmptyState';
import type { NotificationData } from './NotificationItem';

interface NotificationDropdownProps {
  notifications: NotificationData[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Click Outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  // Close on Escape Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      className="absolute right-0 mt-3.5 w-80 origin-top-right rounded-3xl p-4 shadow-xl animate-fade-in z-50 flex flex-col max-h-[420px]"
      style={{ background: '#0a0a0a', border: '0.5px solid rgba(255,255,255,0.15)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <h3 className="font-semibold text-sm" style={{ color: '#fff' }}>Notifications</h3>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-[10px] font-bold transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px]">
        {notifications.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          notifications.map((item) => (
            <NotificationItem key={item.id} notification={item} onMarkRead={onMarkRead} />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="pt-3 mt-2 text-center" style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={onClose}
            className="text-[10px] font-bold uppercase transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            Close Panel
          </button>
        </div>
      )}
    </div>
  );
};
export default NotificationDropdown;

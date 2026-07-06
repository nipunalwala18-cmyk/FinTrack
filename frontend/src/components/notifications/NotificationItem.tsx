import React from 'react';
import {
  PieChart,
  Target,
  Receipt,
  FileText,
  Sparkles,
  Shield,
  Bell,
  Check
} from 'lucide-react';

export interface NotificationData {
  id: string;
  type: 'BUDGET' | 'GOAL' | 'TRANSACTION' | 'REPORT' | 'AI' | 'SECURITY' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationItemProps {
  notification: NotificationData;
  onMarkRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'BUDGET':
        return <PieChart className="h-4 w-4 text-rose-500" />;
      case 'GOAL':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'TRANSACTION':
        return <Receipt className="h-4 w-4 text-emerald-500" />;
      case 'REPORT':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'AI':
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      case 'SECURITY':
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBg = () => {
    switch (notification.type) {
      case 'BUDGET':
        return 'bg-rose-50 dark:bg-rose-950/20';
      case 'GOAL':
        return 'bg-blue-50 dark:bg-blue-950/20';
      case 'TRANSACTION':
        return 'bg-emerald-50 dark:bg-emerald-950/20';
      case 'REPORT':
        return 'bg-purple-50 dark:bg-purple-950/20';
      case 'AI':
        return 'bg-amber-50 dark:bg-amber-950/20';
      case 'SECURITY':
        return 'bg-red-50 dark:bg-red-950/20';
      default:
        return 'bg-gray-50 dark:bg-gray-900/50';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 border border-transparent hover:border-gray-150/20 hover:bg-gray-50/50 dark:hover:bg-gray-900/10 ${
        !notification.read ? 'bg-purple-50/10 dark:bg-purple-950/5' : ''
      }`}
    >
      {/* Icon */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${getBg()}`}>
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-0.5 text-left">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{notification.title}</p>
          <span className="text-[9px] text-gray-400 font-semibold">{notification.time}</span>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">{notification.message}</p>
      </div>

      {/* Mark read button */}
      {!notification.read && (
        <button
          onClick={() => onMarkRead(notification.id)}
          className="h-5 w-5 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all"
          title="Mark as read"
        >
          <Check className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};
export default NotificationItem;

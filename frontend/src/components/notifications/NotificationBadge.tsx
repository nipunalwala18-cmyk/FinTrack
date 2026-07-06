import React from 'react';

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  if (count <= 0) return null;

  return (
    <span
      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
      style={{
        background: '#fff',
        color: '#000',
        border: '1px solid rgba(0,0,0,0.6)',
      }}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
};
export default NotificationBadge;

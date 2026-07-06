import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  variant?: 'destructive' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isPending = false,
  variant = 'destructive',
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  const isDestructive = variant === 'destructive';

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-[95vw] max-w-md p-6 shadow-2xl text-center space-y-5 animate-zoom-in"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.14)',
          borderRadius: 16,
        }}
      >
        {/* Header/Icon */}
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: isDestructive ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.06)',
          }}
        >
          <AlertTriangle
            className="h-6 w-6"
            style={{ color: isDestructive ? 'rgba(248,113,113,0.8)' : '#fff' }}
          />
        </div>

        <div className="space-y-2 text-center">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm font-semibold leading-relaxed text-white/50">{description}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-grow rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-40 cursor-pointer"
            style={{
              background: 'transparent',
              border: '0.5px solid rgba(255,255,255,0.18)',
              color: '#fff',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-grow flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all active:scale-[0.98] cursor-pointer"
            style={{
              background: isDestructive ? '#dc2626' : '#fff',
              color: isDestructive ? '#fff' : '#000',
            }}
            onMouseEnter={e => {
              if (isDestructive) e.currentTarget.style.background = '#b91c1c';
              else e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
            }}
            onMouseLeave={e => {
              if (isDestructive) e.currentTarget.style.background = '#dc2626';
              else e.currentTarget.style.background = '#fff';
            }}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

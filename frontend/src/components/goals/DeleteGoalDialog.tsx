import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDeleteGoal } from '../../hooks/useGoals';

interface DeleteGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string | null;
  goalName: string;
}

export const DeleteGoalDialog: React.FC<DeleteGoalDialogProps> = ({
  isOpen,
  onClose,
  goalId,
  goalName,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const deleteGoal = useDeleteGoal(onClose);

  const isPending = deleteGoal.isPending;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleDelete = () => {
    if (goalId) {
      deleteGoal.mutate(goalId);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
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
          style={{ background: 'rgba(248,113,113,0.08)' }}
        >
          <AlertTriangle className="h-6 w-6" style={{ color: 'rgba(248,113,113,0.8)' }} />
        </div>

        <div className="space-y-2 text-center">
          <h3 className="text-lg font-bold text-white">Delete Goal?</h3>
          <p className="text-sm font-semibold leading-relaxed text-white/50">
            Are you sure you want to delete <span className="font-bold text-white">"{goalName}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-grow rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-40"
            style={{
              background: 'transparent',
              border: '0.5px solid rgba(255,255,255,0.18)',
              color: '#fff',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-grow flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98]"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGoalDialog;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#12131a] border border-gray-100 dark:border-gray-800 space-y-6 animate-zoom-in"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Goal?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-300">"{goalName}"</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50"
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

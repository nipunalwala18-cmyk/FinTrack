import React, { useEffect, useRef } from 'react';
import { useDeleteTransaction } from '../../hooks/useDeleteTransaction';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

export const DeleteTransactionDialog: React.FC<DeleteTransactionDialogProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { mutate: deleteTransaction, isPending } = useDeleteTransaction(onClose);

  // Esc key listener
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
    if (transactionId) {
      deleteTransaction(transactionId);
    }
  };

  if (!isOpen || !transactionId) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-[95vw] max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#12131a] border border-gray-100 dark:border-gray-800 text-center space-y-5 animate-zoom-in"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Delete Transaction?</h3>
          <p className="text-sm text-gray-400 font-medium">
            This action cannot be undone. It will also restore or adjust the corresponding account balance.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-grow rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-grow flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteTransactionDialog;

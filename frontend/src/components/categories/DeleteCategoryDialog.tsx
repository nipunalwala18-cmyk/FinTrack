import React, { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';
import type { Category } from '../../types/category';
import {
  LABEL_CLS, LABEL_STYLE, INPUT_BASE, INPUT_STYLE,
  INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE
} from '../accounts/fieldStyles';

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToDelete: Category | null;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  isOpen,
  onClose,
  categoryToDelete,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: categories = [] } = useCategories();
  const [needsReassignment, setNeedsReassignment] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [reassignToId, setReassignToId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const deleteMutation = useDeleteCategory(() => {
    onClose();
  });

  // Reset local state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNeedsReassignment(false);
      setTransactionCount(0);
      setReassignToId('');
      setErrorMessage('');
    }
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !categoryToDelete) return null;

  const hasChildren = categoryToDelete.children && categoryToDelete.children.length > 0;
  const isDefault = categoryToDelete.isDefault;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isDefault) return;
    if (hasChildren) return;

    if (needsReassignment && !reassignToId) {
      setErrorMessage('Please select a category to reassign transactions to.');
      return;
    }

    try {
      const res = await deleteMutation.mutateAsync({
        id: categoryToDelete.id,
        reassignToId: reassignToId || undefined,
      });

      if (res.requireReassignment) {
        setNeedsReassignment(true);
        setTransactionCount(res.transactionCount || 0);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to delete category';
      setErrorMessage(msg);
    }
  };

  const eligibleCategories: Category[] = [];
  const addCategoryAndChildren = (cat: Category) => {
    if (cat.id !== categoryToDelete.id) {
      eligibleCategories.push(cat);
    }
    if (cat.children) {
      cat.children.forEach((child) => {
        if (child.id !== categoryToDelete.id && cat.id !== categoryToDelete.id) {
          eligibleCategories.push(child);
        }
      });
    }
  };

  categories.forEach(addCategoryAndChildren);

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
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
          <h3 className="text-lg font-bold text-white">Delete Category?</h3>
          <p className="text-sm font-semibold leading-relaxed text-white/50">
            This action cannot be undone. All active transactions in this category must be reallocated first.
          </p>
        </div>

        {/* Content Body */}
        <div className="text-left">
          {isDefault ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs leading-relaxed font-semibold">
                Default categories cannot be deleted. These categories are required for basic application usage.
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all rounded-xl text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : hasChildren ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 text-rose-455 border border-rose-500/20 text-xs leading-relaxed font-semibold">
                This category contains subcategories. You cannot delete it until you remove or reassign all subcategories first.
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all rounded-xl text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleDelete} className="space-y-4">
              {!needsReassignment ? (
                <div className="space-y-1.5 text-center">
                  <p className="text-sm text-white/70">
                    Are you sure you want to delete <span className="font-bold text-white">"{categoryToDelete.name}"</span>?
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold leading-relaxed">
                    Category has {transactionCount} active transactions. Reassign them to another category to prevent them from becoming uncategorized.
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reassignSelect" className={LABEL_CLS} style={LABEL_STYLE}>
                      Reassign transactions to *
                    </label>
                    <select
                      id="reassignSelect"
                      required
                      value={reassignToId}
                      onChange={(e) => setReassignToId(e.target.value)}
                      className={`${INPUT_BASE} appearance-none cursor-pointer`}
                      style={INPUT_STYLE}
                      onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
                      onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
                    >
                      <option value="" style={{ background: '#141414' }}>Select Category</option>
                      {eligibleCategories.map((cat) => (
                        <option key={cat.id} value={cat.id} style={{ background: '#141414' }}>
                          {cat.name} ({cat.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {errorMessage && <p className="text-xs font-semibold text-rose-455 text-center">{errorMessage}</p>}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={deleteMutation.isPending}
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
                  type="submit"
                  disabled={deleteMutation.isPending}
                  className="flex-grow flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98]"
                >
                  {deleteMutation.isPending ? (
                    <>Deleting...</>
                  ) : needsReassignment ? (
                    <>Reassign & Delete</>
                  ) : (
                    <>Delete</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default DeleteCategoryDialog;

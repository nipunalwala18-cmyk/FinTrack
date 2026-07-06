import React, { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';
import type { Category } from '../../types/category';

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

  // Get eligible reassignment categories:
  // 1. Same type (INCOME/EXPENSE)
  // 2. Not the category being deleted
  // 3. Not a child of the category being deleted (to avoid circular issues if any)
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-[#12131a] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-zoom-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete Category
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-left">
          {isDefault ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium">
                  Default categories cannot be deleted. These categories are required for basic application usage.
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 rounded-xl text-sm font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : hasChildren ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium">
                  This category contains subcategories. You cannot delete it until you remove or reassign all subcategories first.
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 rounded-xl text-sm font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDelete} className="space-y-4">
              {!needsReassignment ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete <span className="font-extrabold text-gray-900 dark:text-white">"{categoryToDelete.name}"</span>?
                  </p>
                  <p className="text-xs text-gray-400">
                    Note: Deleting will soft delete this category, removing it from your active list.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400">
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-sm font-medium">
                      Category has <span className="font-extrabold">{transactionCount}</span> transactions. Reassign them to another category to prevent them from becoming uncategorized.
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reassignSelect" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Reassign transactions to *
                    </label>
                    <select
                      id="reassignSelect"
                      required
                      value={reassignToId}
                      onChange={(e) => setReassignToId(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-purple-500 transition-all"
                    >
                      <option value="">Select Category</option>
                      {eligibleCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {errorMessage && <p className="text-xs font-semibold text-red-500">{errorMessage}</p>}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={deleteMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg shadow-red-500/10 transition-colors flex items-center gap-2 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  {deleteMutation.isPending ? (
                    <>Deleting...</>
                  ) : needsReassignment ? (
                    <>Reassign & Delete</>
                  ) : (
                    <>Delete Category</>
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

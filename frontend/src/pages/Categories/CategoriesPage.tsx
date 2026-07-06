import React, { useState } from 'react';
import { Plus, Tags, Loader2, AlertCircle } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { CategoryTypeTabs } from '../../components/categories/CategoryTypeTabs';
import { CategoryTree } from '../../components/categories/CategoryTree';
import { CategoryFormModal } from '../../components/categories/CategoryFormModal';
import { DeleteCategoryDialog } from '../../components/categories/DeleteCategoryDialog';
import type { Category } from '../../types/category';

export const CategoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { data: categories = [], isLoading, error, refetch } = useCategories();

  // Filter categories by type (INCOME or EXPENSE)
  const filteredCategories = categories.filter((cat) => cat.type === activeTab);

  const handleCreateClick = () => {
    setCategoryToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (cat: Category) => {
    setCategoryToEdit(cat);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (cat: Category) => {
    setCategoryToDelete(cat);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Tags className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            Categories
          </h1>
          <p className="text-sm font-semibold text-gray-450 dark:text-gray-400">
            Manage your budget and income structure with drag-and-drop hierarchy.
          </p>
        </div>

        <button
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/15 transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-150 cursor-pointer self-start sm:self-center"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Category
        </button>
      </div>

      {/* 2. Control Row: Tabs */}
      <div className="flex items-center justify-start">
        <CategoryTypeTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* 3. Categories Content Tree */}
      <div className="flex-grow">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Loading your categories...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50/30 p-8 text-center dark:border-red-950/20 dark:bg-red-950/5 space-y-4 max-w-md mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-650 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-gray-900 dark:text-white">Failed to load categories</h4>
              <p className="text-xs font-semibold text-gray-450 dark:text-gray-400">
                An error occurred while communicating with the server. Please check your connection and try again.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-3xl border border-gray-150 bg-white p-12 dark:border-gray-800 dark:bg-[#12131a] max-w-md w-full space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-55/10 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
                <Tags className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">No {activeTab.toLowerCase()} categories found</h3>
                <p className="text-sm text-gray-400 pt-2 leading-relaxed">
                  Start structuring your finances by creating your first category. You can drag and drop them to organize later!
                </p>
              </div>
              <button
                onClick={handleCreateClick}
                className="mx-auto flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 px-5 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Create Category
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-150 bg-white p-6 dark:border-gray-800 dark:bg-[#12131a] max-w-4xl">
            <CategoryTree
              categories={filteredCategories}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        )}
      </div>

      {/* 4. Dialogs & Modals */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        categoryToEdit={categoryToEdit}
        defaultType={activeTab}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        categoryToDelete={categoryToDelete}
      />
    </div>
  );
};
export default CategoriesPage;

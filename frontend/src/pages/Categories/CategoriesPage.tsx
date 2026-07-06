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
    <div className="flex flex-col space-y-5 text-left w-full animate-fade-in">
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Categories
          </h1>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Manage your budget and income structure with drag-and-drop hierarchy.
          </p>
        </div>

        <button
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] px-5 py-2.5 text-sm font-semibold text-black transition-all cursor-pointer self-start sm:self-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* 2. Control Row: Tabs */}
      <div className="flex items-center justify-start">
        <CategoryTypeTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* 3. Categories Content Tree */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-white/50" />
          </div>
        ) : error ? (
          <div
            className="p-8 text-center space-y-4 max-w-md mx-auto"
            style={{
              background: '#0a0a0a',
              border: '0.5px solid rgba(248,113,113,0.25)',
              borderRadius: 16,
            }}
          >
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(248,113,113,0.08)' }}
            >
              <AlertCircle className="h-6 w-6 text-rose-450" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">Failed to load categories</h4>
              <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                An error occurred while communicating with the server. Please try again.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-5 py-2 bg-white text-black hover:bg-white/90 active:scale-[0.98] rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div
            className="p-12 text-center max-w-md mx-auto space-y-5"
            style={{
              background: '#0a0a0a',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 16,
            }}
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <Tags className="h-7 w-7 text-white/60" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">No {activeTab.toLowerCase()} categories found</h3>
              <p className="text-xs font-semibold pt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Start structuring your finances by creating your first category. You can drag and drop them to organize later!
              </p>
            </div>
            <button
              onClick={handleCreateClick}
              className="w-full py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="max-w-4xl">
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

import React, { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import {
  TransactionTable,
  TransactionCard,
  AddTransactionDialog,
  EditTransactionDialog,
  DeleteTransactionDialog,
  TransactionFilters,
  TransactionSearch,
  TransactionPagination,
  TransactionDetails,
} from '../../components/transactions';
import { PlusCircle, Loader2, Receipt } from 'lucide-react';
import type { Transaction } from '../../types/transaction';

export const TransactionsPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({
    search: '',
    type: undefined,
    categoryId: undefined,
    accountId: undefined,
    startDate: undefined,
    endDate: undefined,
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError, refetch } = useTransactions(filters);

  // Modal control states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Active item references
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deleteTxId, setDeleteTxId] = useState<string | null>(null);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: undefined,
      categoryId: undefined,
      accountId: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      limit: filters.limit,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleView = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsViewOpen(true);
  };

  const handleEdit = (tx: Transaction) => {
    setEditTx(tx);
    setIsEditOpen(true);
  };

  const handleDelete = (tx: Transaction) => {
    setDeleteTxId(tx.id);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Transactions</h2>
          <p className="text-sm text-gray-400 font-medium">Record and track your incomes, expenses, and transfers</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/10 hover:bg-purple-700 active:scale-[0.98] transition-all self-start sm:self-center"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <TransactionSearch
          value={filters.search}
          onChange={(val) => setFilters((prev) => ({ ...prev, search: val, page: 1 }))}
        />
      </div>

      <TransactionFilters
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-105 bg-red-50/20 p-8 text-center dark:border-red-950/25">
          <p className="text-sm text-red-500 font-bold">Failed to load transactions. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
          >
            Retry
          </button>
        </div>
      ) : !data || data.transactions.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-gray-150 bg-white p-12 text-center dark:border-gray-800 dark:bg-[#12131a] max-w-md mx-auto space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
            <Receipt className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">No transactions found</h3>
            <p className="text-sm text-gray-400">Add your first transaction to start tracking your finances.</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-500/15"
          >
            Add Transaction
          </button>
        </div>
      ) : (
        /* Data Loaded View */
        <div className="space-y-4">
          {/* Desktop Table View */}
          <TransactionTable
            transactions={data.transactions}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Mobile Card Grid View */}
          <div className="grid gap-4 grid-cols-1 md:hidden">
            {data.transactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <TransactionPagination
            page={filters.page}
            totalPages={data.pagination.totalPages}
            limit={filters.limit}
            total={data.pagination.total}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      )}

      {/* Dialog Modals */}
      <AddTransactionDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      <EditTransactionDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        transaction={editTx}
      />

      <DeleteTransactionDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        transactionId={deleteTxId}
      />

      <TransactionDetails
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
};
export default TransactionsPage;

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
    <div className="space-y-5 w-full text-left animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Transactions</h1>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Record and track your incomes, expenses, and transfers</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] px-5 py-2.5 text-sm font-semibold text-black transition-all cursor-pointer self-start sm:self-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        </div>
      ) : isError ? (
        <div
          className="p-8 text-center space-y-4 max-w-md mx-auto"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(248,113,113,0.25)',
            borderRadius: 16,
          }}
        >
          <p className="text-sm font-semibold text-rose-400">Failed to load transactions. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-white text-black rounded-xl text-xs font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : !data || data.transactions.length === 0 ? (
        /* Empty State */
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
            <Receipt className="h-7 w-7 text-white/60" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">No transactions found</h3>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Add your first transaction to start tracking your finances.</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-full py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
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

import React, { useEffect, useRef } from 'react';
import { AccountForm } from './AccountForm';

interface AddAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAccountDialog: React.FC<AddAccountDialogProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Esc key closes dialog (only if not submitting/loading)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        // We will delegate check to onClose or check body classes, but simple close is standard
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

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-[95vw] max-w-4xl max-h-[95vh] md:max-h-[90vh] rounded-3xl bg-white shadow-2xl dark:bg-[#12131a] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-zoom-in"
      >
        {/* AccountForm will render the Header, Content, and Footer self-contained */}
        <AccountForm onSuccess={onClose} onClose={onClose} />
      </div>
    </div>
  );
};
export default AddAccountDialog;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all duration-300 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="w-[95vw] max-w-4xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in"
        style={{
          background: '#0a0a0a',
          border: '0.5px solid rgba(255,255,255,0.14)',
          borderRadius: 16,
        }}
      >
        {/* AccountForm will render the Header, Content, and Footer self-contained */}
        <AccountForm onSuccess={onClose} onClose={onClose} />
      </div>
    </div>
  );
};
export default AddAccountDialog;

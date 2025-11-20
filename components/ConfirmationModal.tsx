
import React from 'react';

interface ConfirmationModalProps {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColorClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColorClass = 'bg-blue-600 hover:bg-blue-700',
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[110] flex items-center justify-center p-4 animate-fade">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-pop border-2 border-blue-100">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          {title}
        </h3>
        <div className="text-gray-600 mb-6 text-base leading-relaxed">
          {message}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white font-bold rounded-lg shadow-md transition-transform transform active:scale-95 ${confirmColorClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

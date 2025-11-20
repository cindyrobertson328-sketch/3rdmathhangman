
import React from 'react';
import type { GameHistoryItem } from '../types';

interface HistoryModalProps {
  history: GameHistoryItem[];
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ history, onClose }) => {
  const getStatusStyles = (status: 'won' | 'lost' | 'skipped') => {
    switch (status) {
      case 'won':
        return {
          container: 'bg-green-50 border-green-200',
          badge: 'bg-green-200 text-green-800',
          label: 'Solved'
        };
      case 'lost':
        return {
          container: 'bg-red-50 border-red-200',
          badge: 'bg-red-200 text-red-800',
          label: 'Missed'
        };
      case 'skipped':
        return {
          container: 'bg-gray-50 border-gray-200',
          badge: 'bg-gray-200 text-gray-800',
          label: 'Skipped'
        };
      default:
        return {
            container: 'bg-gray-50 border-gray-200',
            badge: 'bg-gray-200 text-gray-800',
            label: 'Unknown'
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[110] flex items-center justify-center p-4 animate-fade">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-800">Session History</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-3 flex-grow">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-8 italic">
              No words attempted yet in this session.
            </div>
          ) : (
            history.map((item, index) => {
              const styles = getStatusStyles(item.status);
              return (
                <div 
                    key={index} 
                    className={`flex justify-between items-center p-3 rounded-lg border ${styles.container}`}
                >
                    <div className="flex-1 mr-4">
                    <div className="font-bold text-lg text-gray-800">{item.word}</div>
                    <div className="text-sm text-gray-600 leading-tight">{item.definition}</div>
                    </div>
                    <div className={`shrink-0 font-bold px-3 py-1 rounded-full text-sm uppercase ${styles.badge}`}>
                    {styles.label}
                    </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
                onClick={onClose}
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;

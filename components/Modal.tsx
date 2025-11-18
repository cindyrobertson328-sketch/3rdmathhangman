
import React from 'react';

interface ModalProps {
  status: 'won' | 'lost';
  word: string;
  onPlayAgain: () => void;
  onExit: () => void;
}

const Modal: React.FC<ModalProps> = ({ status, word, onPlayAgain, onExit }) => {
  const isWinner = status === 'won';
  const title = isWinner ? 'Congratulations! 🎉' : 'Game Over! 😥';
  const message = isWinner ? 'You guessed the word!' : `The word was: ${word}`;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 p-4">
      <div className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-md ${isWinner ? 'bg-green-100' : 'bg-red-100'}`}>
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isWinner ? 'text-green-800' : 'text-red-800'}`}>{title}</h2>
        <p className={`text-lg md:text-xl mb-6 ${isWinner ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full px-8 py-3 bg-yellow-400 text-yellow-900 font-bold text-xl rounded-lg shadow-md hover:bg-yellow-500 transition-all transform hover:scale-105"
          >
            Play Again
          </button>
          <button
            onClick={onExit}
            className="w-full px-8 py-3 bg-gray-400 text-gray-900 font-bold text-lg rounded-lg shadow-md hover:bg-gray-500 transition-all transform hover:scale-105"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

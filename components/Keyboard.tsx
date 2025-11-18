
import React from 'react';
import type { GuessedLetters } from '../types';

interface KeyboardProps {
  onGuess: (letter: string) => void;
  guessedLetters: GuessedLetters;
}

const Keyboard: React.FC<KeyboardProps> = ({ onGuess, guessedLetters }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
      {alphabet.map((letter) => {
        const isGuessed = guessedLetters.correct.includes(letter) || guessedLetters.incorrect.includes(letter);
        const isCorrect = guessedLetters.correct.includes(letter);
        
        const buttonClass = isGuessed
          ? (isCorrect 
              ? 'bg-green-500 text-white cursor-not-allowed' 
              : 'bg-red-500 text-white cursor-not-allowed opacity-70')
          : 'bg-blue-500 hover:bg-blue-600 text-white';

        return (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={isGuessed}
            className={`w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl font-bold rounded-md shadow-sm transition-transform transform active:scale-95 ${buttonClass}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;

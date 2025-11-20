
import React from 'react';
import type { GuessedLetters } from '../types';

interface KeyboardProps {
  onGuess: (letter: string) => void;
  guessedLetters: GuessedLetters;
}

const Keyboard: React.FC<KeyboardProps> = ({ onGuess, guessedLetters }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-wrap justify-center gap-1 md:gap-1.5 max-w-lg mx-auto py-1">
      {alphabet.map((letter) => {
        const isGuessed = guessedLetters.correct.includes(letter) || guessedLetters.incorrect.includes(letter);
        const isCorrect = guessedLetters.correct.includes(letter);
        
        const baseClass = "w-8 h-9 md:w-10 md:h-10 text-base md:text-lg font-bold rounded md:rounded-lg shadow-sm transition-all duration-200 transform";
        
        const stateClass = isGuessed
          ? (isCorrect 
              ? 'bg-green-500 text-white cursor-not-allowed animate-pop' 
              : 'bg-red-500 text-white cursor-not-allowed opacity-60 animate-pop')
          : 'bg-blue-500 hover:bg-blue-600 text-white hover:-translate-y-0.5 hover:shadow-md active:scale-95 active:shadow-sm';

        return (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={isGuessed}
            className={`${baseClass} ${stateClass}`}
            aria-label={`Guess letter ${letter}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;

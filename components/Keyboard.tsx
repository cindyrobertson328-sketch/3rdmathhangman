
import React from 'react';
import type { GuessedLetters } from '../types';

interface KeyboardProps {
  onGuess: (letter: string) => void;
  guessedLetters: GuessedLetters;
}

const Keyboard: React.FC<KeyboardProps> = ({ onGuess, guessedLetters }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-wrap justify-center gap-0.5 md:gap-1 max-w-md mx-auto py-0.5">
      {alphabet.map((letter) => {
        const isGuessed = guessedLetters.correct.includes(letter) || guessedLetters.incorrect.includes(letter);
        const isCorrect = guessedLetters.correct.includes(letter);
        
        const baseClass = "w-7 h-8 md:w-8 md:h-9 text-sm md:text-base font-bold rounded shadow-sm transition-all duration-200 transform";
        
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


import React from 'react';

interface WordDisplayProps {
  word: string;
  correctGuesses: string[];
  revealedLetter?: string | null;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, correctGuesses, revealedLetter }) => {
  return (
    <div className="flex justify-center gap-0.5 md:gap-1 my-0.5 flex-wrap px-1">
      {word.split('').map((letter, index) => {
        const isLetter = /^[A-Z]$/.test(letter);
        const isRevealed = letter === revealedLetter;
        const isGuessed = correctGuesses.includes(letter);
        
        // If it's not a letter (e.g. space in "WHOLE NUMBER"), render a separator
        if (!isLetter) {
           return (
             <div key={index} className="flex items-center justify-center w-2 md:w-4 h-6 md:h-10">
                {/* Visually hidden but structurally present, or just a gap */}
                {letter === ' ' ? <span className="w-full"></span> : <span className="text-base font-bold text-blue-800">{letter}</span>}
             </div>
           );
        }
        
        // Base styles for unguessed letters (placeholders)
        let stateClasses = 'bg-white text-gray-300 border-gray-300';
        
        if (isRevealed) {
            // Hint revealed: Distinct purple style to match hint button, with pop animation
            stateClasses = 'bg-purple-100 text-purple-700 border-purple-400 ring-2 ring-purple-200 animate-pop shadow-lg scale-105';
        } else if (isGuessed) {
            // Correct guess: blue tint and pop animation
            stateClasses = 'bg-blue-50 text-blue-600 border-blue-300 animate-pop';
        }

        return (
          <span
            key={index}
            className={`flex items-center justify-center w-6 h-8 md:w-8 md:h-10 text-base md:text-xl font-bold rounded shadow-sm md:shadow-md border-b-2 md:border-b-4 transition-all duration-500 ${stateClasses}`}
          >
            {isGuessed ? letter : '_'}
          </span>
        );
      })}
    </div>
  );
};

export default WordDisplay;

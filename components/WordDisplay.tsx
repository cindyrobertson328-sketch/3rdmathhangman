
import React from 'react';

interface WordDisplayProps {
  word: string;
  correctGuesses: string[];
  revealedLetter?: string | null;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, correctGuesses, revealedLetter }) => {
  return (
    <div className="flex justify-center gap-1.5 md:gap-2 my-1 md:my-2">
      {word.split('').map((letter, index) => {
        const isRevealed = letter === revealedLetter;
        const isGuessed = correctGuesses.includes(letter);
        
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
            className={`flex items-center justify-center w-8 h-10 md:w-11 md:h-14 text-xl md:text-3xl font-bold rounded-md md:rounded-lg shadow-sm md:shadow-md border-b-2 md:border-b-4 transition-all duration-500 ${stateClasses}`}
          >
            {isGuessed ? letter : '_'}
          </span>
        );
      })}
    </div>
  );
};

export default WordDisplay;

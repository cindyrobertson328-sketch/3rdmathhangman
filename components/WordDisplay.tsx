import React from 'react';

interface WordDisplayProps {
  word: string;
  correctGuesses: string[];
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, correctGuesses }) => {
  return (
    <div className="flex justify-center gap-2 md:gap-4 my-2">
      {word.split('').map((letter, index) => (
        <span
          key={index}
          className="flex items-center justify-center bg-white text-gray-800 w-10 h-12 md:w-14 md:h-16 text-2xl md:text-4xl font-bold rounded-lg shadow-md border-b-4 border-gray-300"
        >
          {correctGuesses.includes(letter) ? letter : ''}
        </span>
      ))}
    </div>
  );
};

export default WordDisplay;
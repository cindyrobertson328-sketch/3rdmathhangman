
import React from 'react';

interface IncorrectGuessesProps {
  incorrectLetters: string[];
}

const IncorrectGuesses: React.FC<IncorrectGuessesProps> = ({ incorrectLetters }) => {
  return (
    <div className="w-full flex flex-col items-center mt-0 md:mt-1 mb-1 md:mb-2">
       <div className="text-[10px] md:text-xs font-bold text-red-800 uppercase tracking-wider mb-0.5">Incorrect</div>
       <div className="flex flex-wrap justify-center gap-1 md:gap-2 min-h-[1.5rem]">
         {incorrectLetters.length > 0 ? (
            incorrectLetters.map((letter) => (
                <span key={letter} className="text-lg md:text-xl font-mono font-bold text-red-600 line-through decoration-2 animate-bounce-in inline-block">
                {letter}
                </span>
            ))
         ) : (
             <span className="text-gray-400 text-xs italic py-1">None yet</span>
         )}
       </div>
    </div>
  );
};

export default IncorrectGuesses;

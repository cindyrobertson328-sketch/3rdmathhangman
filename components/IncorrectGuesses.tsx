
import React from 'react';

interface IncorrectGuessesProps {
  incorrectLetters: string[];
}

const IncorrectGuesses: React.FC<IncorrectGuessesProps> = ({ incorrectLetters }) => {
  return (
    <div className="w-full flex flex-col items-center mt-0 mb-1">
       <div className="text-[9px] md:text-[10px] font-bold text-red-800 uppercase tracking-wider mb-0.5">Incorrect</div>
       <div className="flex flex-wrap justify-center gap-1 min-h-[1.25rem]">
         {incorrectLetters.length > 0 ? (
            incorrectLetters.map((letter) => (
                <span key={letter} className="text-base md:text-lg font-mono font-bold text-red-600 line-through decoration-2 animate-bounce-in inline-block">
                {letter}
                </span>
            ))
         ) : (
             <span className="text-gray-400 text-[10px] italic">None yet</span>
         )}
       </div>
    </div>
  );
};

export default IncorrectGuesses;

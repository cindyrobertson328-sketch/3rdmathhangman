
import React from 'react';
import type { Difficulty } from '../types';
import { DIFFICULTY_SETTINGS } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, difficulty, setDifficulty }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 overflow-y-auto no-scrollbar">
      <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-2 md:mb-4 drop-shadow-lg">
        Math Hangman
      </h1>
      <h2 className="text-xl md:text-2xl text-blue-600 font-bold mb-4 md:mb-6">Third Grade Edition</h2>
      
      <p className="text-base md:text-lg text-blue-600 mb-6 max-w-xl hidden md:block">
        Read the definition, guess the letters, and solve the math vocabulary word before the hangman is complete!
      </p>

      <div className="mb-6 w-full max-w-md">
        <p className="text-blue-800 font-bold mb-2 uppercase tracking-wide text-xs md:text-sm">Select Difficulty</p>
        <div className="flex gap-2 md:gap-3 justify-center">
          {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((level) => {
            const config = DIFFICULTY_SETTINGS[level];
            const isSelected = difficulty === level;
            
            return (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-2 md:py-3 px-2 rounded-xl font-bold transition-all transform border-2 
                  ${isSelected 
                    ? `${config.color} text-white border-transparent scale-105 shadow-lg ring-2 ring-offset-2 ring-blue-200` 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
              >
                <div className="text-base md:text-lg">{level}</div>
                <div className={`text-[9px] md:text-[10px] uppercase mt-0.5 ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>
                    {config.maxGuesses} Guesses
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2 italic min-h-[1.25rem]">
            {DIFFICULTY_SETTINGS[difficulty].description}
        </p>
      </div>

      <button
        onClick={onStart}
        className="px-10 py-3 md:py-4 bg-blue-600 text-white font-bold text-xl md:text-2xl rounded-xl md:rounded-2xl shadow-xl hover:bg-blue-700 transition-all transform hover:scale-105 hover:shadow-2xl"
      >
        Start Game
      </button>
    </div>
  );
};

export default WelcomeScreen;

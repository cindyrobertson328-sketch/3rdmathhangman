
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl md:text-7xl font-bold text-blue-800 mb-4 drop-shadow-lg">
        Math Hangman for 3rd Grade
      </h1>
      <p className="text-lg md:text-xl text-blue-600 mb-8 max-w-xl">
        Read the definition, guess the letters, and solve the math vocabulary word before the hangman is complete!
      </p>
      <button
        onClick={onStart}
        className="px-10 py-4 bg-green-500 text-white font-bold text-2xl rounded-xl shadow-lg hover:bg-green-600 transition-all transform hover:scale-105"
      >
        Start Game
      </button>
    </div>
  );
};

export default WelcomeScreen;

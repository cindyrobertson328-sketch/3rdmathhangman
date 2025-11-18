
import React from 'react';

interface HangmanFigureProps {
  wrongGuesses: number;
}

const HangmanFigure: React.FC<HangmanFigureProps> = ({ wrongGuesses }) => {
  const parts = [
    // Head
    <circle key="head" cx="100" cy="50" r="20" stroke="currentColor" strokeWidth="4" fill="none" />,
    // Body
    <line key="body" x1="100" y1="70" x2="100" y2="130" stroke="currentColor" strokeWidth="4" />,
    // Left Arm
    <line key="left-arm" x1="100" y1="90" x2="70" y2="120" stroke="currentColor" strokeWidth="4" />,
    // Right Arm
    <line key="right-arm" x1="100" y1="90" x2="130" y2="120" stroke="currentColor" strokeWidth="4" />,
    // Left Leg
    <line key="left-leg" x1="100" y1="130" x2="70" y2="160" stroke="currentColor" strokeWidth="4" />,
    // Right Leg
    <line key="right-leg" x1="100" y1="130" x2="130" y2="160" stroke="currentColor" strokeWidth="4" />,
  ];

  return (
    <div className="relative w-40 h-56 md:w-52 md:h-64">
      <svg viewBox="0 0 200 250" className="w-full h-full text-gray-800">
        {/* Gallows */}
        <line x1="20" y1="230" x2="120" y2="230" strokeWidth="4" stroke="currentColor" />
        <line x1="70" y1="230" x2="70" y2="20" strokeWidth="4" stroke="currentColor" />
        <line x1="70" y1="20" x2="100" y2="20" strokeWidth="4" stroke="currentColor" />
        <line x1="100" y1="20" x2="100" y2="30" strokeWidth="4" stroke="currentColor" />
        {/* Figure parts */}
        {parts.slice(0, wrongGuesses)}
      </svg>
    </div>
  );
};

export default HangmanFigure;

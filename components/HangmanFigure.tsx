
import React from 'react';

interface HangmanFigureProps {
  wrongGuesses: number;
  maxGuesses: number;
}

const HangmanFigure: React.FC<HangmanFigureProps> = ({ wrongGuesses, maxGuesses }) => {
  const parts = [
    // Head - Rounded and smooth
    <circle key="head" cx="120" cy="70" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" />,
    // Body - Tapered look
    <line key="body" x1="120" y1="88" x2="120" y2="145" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />,
    // Left Arm - Curved slightly upwards then down for a natural hang
    <path key="left-arm" d="M120 100 Q 90 95 90 120" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />,
    // Right Arm - Curved slightly upwards then down
    <path key="right-arm" d="M120 100 Q 150 95 150 120" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />,
    // Left Leg - Curved outward
    <path key="left-leg" d="M120 145 Q 105 170 95 185" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />,
    // Right Leg - Curved outward
    <path key="right-leg" d="M120 145 Q 135 170 145 185" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />,
  ];

  // Logic to map the number of wrong guesses (which varies by difficulty) 
  // to the 6 available body parts.
  const totalParts = parts.length;
  
  // If maxGuesses is 6, ratio is 1:1. 
  // If maxGuesses is 9 (Easy), we draw a part every ~1.5 mistakes.
  // We use Math.ceil to ensure the last mistake completes the figure.
  const percentComplete = Math.min(wrongGuesses / maxGuesses, 1);
  const partsToShowCount = wrongGuesses === 0 ? 0 : Math.ceil(percentComplete * totalParts);

  return (
    <div className="relative w-32 h-40 md:w-40 md:h-48 lg:w-52 lg:h-64 transition-all duration-300 ease-in-out hover:scale-105 hover:drop-shadow-xl">
      <svg viewBox="0 0 200 250" className="w-full h-full text-gray-800">
        {/* Gallows Structure - Wood Styling */}
        <g className="text-amber-800">
            {/* Base */}
            <path d="M20 240 L100 240" strokeWidth="8" stroke="currentColor" strokeLinecap="round" />
            {/* Vertical Pole */}
            <path d="M60 240 L60 20" strokeWidth="8" stroke="currentColor" strokeLinecap="round" />
            {/* Top Beam */}
            <path d="M56 20 L140 20" strokeWidth="8" stroke="currentColor" strokeLinecap="round" />
            {/* Angled Support */}
            <path d="M60 70 L100 20" strokeWidth="5" stroke="currentColor" strokeLinecap="round" />
        </g>
        
        {/* Rope - distinct texture */}
        <line x1="120" y1="20" x2="120" y2="52" strokeWidth="3" stroke="#b45309" strokeDasharray="3 2" />
        
        {/* Figure Parts - inherits text-slate-700 for a graphite/ink look */}
        <g className="text-slate-700">
            {parts.slice(0, partsToShowCount)}
        </g>
      </svg>
    </div>
  );
};

export default HangmanFigure;

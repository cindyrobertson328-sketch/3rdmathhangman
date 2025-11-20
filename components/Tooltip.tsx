
import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="group relative flex flex-col items-center">
      {children}
      <div className="absolute bottom-full mb-2 md:mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">
         <div className="bg-slate-800/95 backdrop-blur-sm text-white text-xs md:text-sm font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-700/50">
            {content}
            {/* Downward pointing arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800/95"></div>
         </div>
      </div>
    </div>
  );
};

export default Tooltip;

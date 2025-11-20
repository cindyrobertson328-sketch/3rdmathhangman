
import React from 'react';

interface ToggleSwitchProps {
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, isChecked, onChange }) => {
  return (
    <div className="flex items-center cursor-pointer gap-2 bg-white/50 px-3 py-1 rounded-full hover:bg-white/80 transition-colors" onClick={() => onChange(!isChecked)}>
      <span className="text-sm font-bold text-blue-900 select-none">{label}</span>
      <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${isChecked ? 'bg-green-500' : 'bg-gray-400'}`}>
        <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${isChecked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  );
};

export default ToggleSwitch;

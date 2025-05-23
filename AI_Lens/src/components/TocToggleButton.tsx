import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Or outline, adjust as needed

interface TocToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const TocToggleButton: React.FC<TocToggleButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 m-2 bg-slate-200 hover:bg-slate-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors absolute top-1/2 -translate-y-1/2"
      aria-label={isOpen ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
      style={{ zIndex: 10 }} // Ensure it's clickable
    >
      {isOpen ? (
        <ChevronLeftIcon className="h-6 w-6 text-slate-700" />
      ) : (
        <ChevronRightIcon className="h-6 w-6 text-slate-700" />
      )}
    </button>
  );
};

export default TocToggleButton;

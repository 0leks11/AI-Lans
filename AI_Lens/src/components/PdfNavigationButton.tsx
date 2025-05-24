import React, { ReactNode } from 'react';

export interface PdfNavigationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: ReactNode;
  tooltip?: string; // Added tooltip prop
}

export const PdfNavigationButton: React.FC<PdfNavigationButtonProps> = ({
  onClick,
  disabled,
  icon,
  tooltip, // Destructure tooltip
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 rounded-full hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group transition-colors duration-150"
      title={tooltip} // Use tooltip as title attribute
    >
      {icon}
    </button>
  );
};

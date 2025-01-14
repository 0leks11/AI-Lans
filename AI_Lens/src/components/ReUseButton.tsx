import React, { ReactNode } from "react";
import Arrow from "./Arrow";

interface ReUseButtonProps {
  onClick: () => void;
  button: ReactNode;
  icon?: ReactNode;
}

export const ReUseButton: React.FC<ReUseButtonProps> = ({
  onClick,
  button,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {button}
      <Arrow icon={icon} />
    </button>
  );
};

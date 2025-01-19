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
    <button onClick={onClick}>
      {button}
      <Arrow icon={icon} />
    </button>
  );
};

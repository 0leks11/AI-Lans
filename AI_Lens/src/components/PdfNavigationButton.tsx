import React, { FC, ReactNode } from "react";
import Arrow from "./Arrow";

interface PdfNavigationButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

export const PdfNavigationButton: FC<PdfNavigationButtonProps> = ({
  onClick,
  disabled,
  icon,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  return (
    <a
      onClick={handleClick}
      className={`group flex transition-colors no-underline ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <Arrow icon={icon} />
    </a>
  );
};

import React, { FC, ReactNode, useState } from "react";
import Arrow from "./Arrow";

type PdfUploaderButtonProps = {
  content: ReactNode;
  button: ReactNode;
  icon?: ReactNode;
  type?: string;
  className?: string;
  accept?: string;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PdfUploaderButton: FC<PdfUploaderButtonProps> = ({
  content,
  button,
  icon,
  type,
  accept,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center">
        {button}
        {type}
        {className}
        {accept}
        <Arrow isOpen={isOpen} icon={icon} />
      </button>

      {isOpen && content}
    </div>
  );
};

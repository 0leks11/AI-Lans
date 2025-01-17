import React, { FC, ReactNode, useState } from "react";
import Arrow from "./Arrow";

type CollapsibleProps = {
  content: ReactNode;
  button: ReactNode;
  icon?: ReactNode;
  directionAbove?: boolean;
};

export const Collapsible: FC<CollapsibleProps> = ({
  content,
  button,
  icon,
  directionAbove,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      {isOpen && directionAbove && content}
      <button onClick={() => setIsOpen(!isOpen)} className="flex">
        {button}
        <Arrow isOpen={isOpen} icon={icon} />
      </button>
      {isOpen && !directionAbove && content}
    </div>
  );
};

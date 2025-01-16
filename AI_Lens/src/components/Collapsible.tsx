import React, { FC, ReactNode, useState } from "react";
import Arrow from "./Arrow";

type CollapsibleProps = {
  content: ReactNode;
  button: ReactNode;
  icon?: ReactNode;
};

export const Collapsible: FC<CollapsibleProps> = ({
  content,
  button,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      {isOpen && content}
      <button onClick={() => setIsOpen(!isOpen)} className="flex ">
        {button}
        <Arrow isOpen={isOpen} icon={icon} />
      </button>
    </div>
  );
};

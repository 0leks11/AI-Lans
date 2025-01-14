// src/components/ResumeSection/Arrow.tsx
import React from "react";

interface ArrowProps {
  isOpen?: boolean;
  icon?: React.ReactNode;
}

const Arrow: React.FC<ArrowProps> = ({ isOpen, icon }) => {
  if (!icon) return null;

  let rotateClass = "";
  if (typeof isOpen === "boolean") {
    rotateClass = isOpen ? "rotate-180" : "rotate-0";
  }
  return (
    <span
      className={`transform transition-transform duration-300 mr-4 ${rotateClass}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {icon}
    </span>
  );
};

export default Arrow;

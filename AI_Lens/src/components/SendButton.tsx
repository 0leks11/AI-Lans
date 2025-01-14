import React from "react";

interface SendButtonProps {
  onClick: () => void;
}

export const SendButton: React.FC<SendButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      AI Lens
    </button>
  );
};

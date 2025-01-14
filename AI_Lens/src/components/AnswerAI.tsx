import React from "react";
import { useOpenAI } from "./hooks/useOpenAI";
import { SendButton } from "./SendButton";

type AnswerAIProps = {
  pdfCanvas: HTMLCanvasElement;
};

export const AnswerAI: React.FC<AnswerAIProps> = ({ pdfCanvas }) => {
  const { responseHtml, sendToOpenAI } = useOpenAI();

  const handleSendToOpenAI = () => {
    if (pdfCanvas) {
      sendToOpenAI(pdfCanvas);
    } else {
      console.error("Canvas is not ready");
    }
  };

  return (
    <div className="h-full border-l bg-white shadow-lg p-4 overflow-y">
      <div
        className="mt-4 p-2 border w-full"
        dangerouslySetInnerHTML={{ __html: responseHtml }}
      />
      <div className="mt-4">
        <SendButton onClick={handleSendToOpenAI} />
      </div>
    </div>
  );
};

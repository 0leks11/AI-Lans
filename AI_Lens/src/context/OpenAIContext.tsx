import React, { createContext, useContext } from "react";
import { useOpenAI } from "../hooks/useOpenAI";

interface OpenAIContextProps {
  responseHtml: string;
  sendToOpenAI: (canvas?: HTMLCanvasElement) => Promise<void>;
  handleResponse: (
    canvasRef: React.RefObject<HTMLCanvasElement>
  ) => Promise<void>;
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const OpenAIContext = createContext<OpenAIContextProps | undefined>(undefined);

export const OpenAIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const openAI = useOpenAI();
  return (
    <OpenAIContext.Provider value={openAI}>{children}</OpenAIContext.Provider>
  );
};

export const useOpenAIContext = () => {
  const context = useContext(OpenAIContext);
  if (!context) {
    throw new Error("useOpenAIContext must be used within an OpenAIProvider");
  }
  return context;
};

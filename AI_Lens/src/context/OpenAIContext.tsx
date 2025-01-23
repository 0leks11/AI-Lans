import React, { createContext, useContext } from "react";
import { useOpenAI } from "../hooks/useOpenAI";

interface OpenAIContextProps {
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
  preloadPageAI: (pageNum: number) => Promise<void>;
  getPageAIResponse: (pageNum: number) => string | undefined;
  pageResponses: Record<number, string>;
  aiLensActive: boolean;
  setAiLensActive: React.Dispatch<React.SetStateAction<boolean>>;
  sendCurrentPage: (pageNum: number) => Promise<void>;
}

const OpenAIContext = createContext<OpenAIContextProps | undefined>(undefined);

export const OpenAIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    userPrompt,
    setUserPrompt,
    preloadPageAI,
    getPageAIResponse,
    pageResponses,
    aiLensActive,
    setAiLensActive,
    sendCurrentPage,
  } = useOpenAI();

  return (
    <OpenAIContext.Provider
      value={{
        userPrompt,
        setUserPrompt,
        preloadPageAI,
        getPageAIResponse,
        pageResponses,
        aiLensActive,
        setAiLensActive,
        sendCurrentPage,
      }}
    >
      {children}
    </OpenAIContext.Provider>
  );
};

export const useOpenAIContext = () => {
  const context = useContext(OpenAIContext);
  if (!context) {
    throw new Error("useOpenAIContext must be used within an OpenAIProvider");
  }
  return context;
};

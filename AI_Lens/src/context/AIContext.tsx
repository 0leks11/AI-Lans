import React, { createContext, useContext } from "react";
import { useOpenAI } from "../hooks/useOpenAI";

interface AIContextProps {
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
  preloadPageAI: (pageNum: number) => Promise<void>;
  getPageAIResponse: (pageNum: number) => string | undefined;
  pageResponses: Record<number, string>;
  aiLensActive: boolean;
  setAiLensActive: React.Dispatch<React.SetStateAction<boolean>>;
  sendCurrentPage: (pageNum: number) => Promise<void>;
}

const AIContext = createContext<AIContextProps | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({
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
    <AIContext.Provider
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
    </AIContext.Provider>
  );
};

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAIContext must be used within an AIProvider");
  }
  return context;
};

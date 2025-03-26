import React, { createContext, useContext, useState } from "react";

interface OpenAIContextProps {
  openAIKey: string | null;
  setOpenAIKey: (key: string) => void;
  isConnected: boolean;
}

const OpenAIContext = createContext<OpenAIContextProps | undefined>(undefined);

export const OpenAIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openAIKey, setOpenAIKey] = useState<string | null>(null);

  return (
    <OpenAIContext.Provider
      value={{
        openAIKey,
        setOpenAIKey,
        isConnected: !!openAIKey,
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

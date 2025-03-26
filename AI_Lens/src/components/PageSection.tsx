import React from "react";
import { PdfReader } from "./PdfReader";
import { OpenAIProvider } from "../context/OpenAIContext";
import { AIProvider } from "../context/AIContext";
import { ApiKeyInput } from "./ApiKeyInput";
import { useOpenAIContext } from "../context/OpenAIContext";

export const PageSection: React.FC = () => {
  return (
    <OpenAIProvider>
      <AIProvider>
        <PageSectionContent />
      </AIProvider>
    </OpenAIProvider>
  );
};

const PageSectionContent: React.FC = () => {
  const { isConnected } = useOpenAIContext();

  return (
    <section className="flex flex-col items-center min-h-screen bg-slate-100">
      {!isConnected && (
        <div className="min-w-[550px] mt-8">
          <ApiKeyInput />
        </div>
      )}
      <div className="w-full">
        <PdfReader />
      </div>
    </section>
  );
};

export default PageSection;

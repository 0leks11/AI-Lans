import React from "react";
import { PdfReader } from "./PdfReader";
import { OpenAIProvider } from "../context/OpenAIContext";

export const PageSection: React.FC = () => {
  return (
    <section className="h-auto max-w-8xl ">
      <OpenAIProvider>
        <PdfReader />
      </OpenAIProvider>
    </section>
  );
};

export default PageSection;

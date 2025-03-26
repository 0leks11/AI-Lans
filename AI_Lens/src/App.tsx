import React from "react";
import PageSection from "./components/PageSection";
import { PDFProvider } from "./context/pdfContext";

export const App: React.FC = () => {
  return (
    <PDFProvider pdfUrl="">
      <PageSection />
    </PDFProvider>
  );
};

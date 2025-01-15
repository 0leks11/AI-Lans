import React from "react";
import { PdfReader } from "./PdfReader";
import PdfUploader from "./PdfUploader";

export const PageSection: React.FC = () => {
  return (
    <section className="h-auto max-w-8xl ">
      <PdfReader />
      <div className="ml-auto">
        <PdfUploader />
      </div>
    </section>
  );
};

export default PageSection;

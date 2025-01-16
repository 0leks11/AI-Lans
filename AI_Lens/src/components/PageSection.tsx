import React from "react";
import { PdfReader } from "./PdfReader";

export const PageSection: React.FC = () => {
  return (
    <section className="h-auto max-w-8xl ">
      <PdfReader />
    </section>
  );
};

export default PageSection;

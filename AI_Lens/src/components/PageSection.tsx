import React from "react";
import { PdfReader } from "./PdfReader";
import PDFUploader from "./PDFUploader";

export const PageSection: React.FC = () => {
  return (
    <section className=" max-w-8xl ">
      <PdfReader />
      {/* <div className="ml-auto">
              <ReUseButton
                onClick={}
                button={<p>Load file</p>}
              />
            </div> */}
    </section>
  );
};

export default PageSection;

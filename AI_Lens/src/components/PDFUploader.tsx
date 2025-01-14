import React from "react";
import { usePdf } from "../context/pdfContext";

function PDFUploader() {
  const { openPDF } = usePdf();

  const handleFileChange = (event) => {
    const file = event.target.files[0] as File;

    if (file && file.type === "application/pdf") {
      openPDF(file);
    }
  };

  return (
    <label>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
    </label>
  );
}

export default PDFUploader;

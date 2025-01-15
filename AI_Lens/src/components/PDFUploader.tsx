import React from "react";
import { usePdf } from "../context/pdfContext";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

function PDFUploader() {
  const { openPDF } = usePdf();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0] as File;

      if (file && file.type === "application/pdf") {
        openPDF(file);
      }
    }
  };

  return (
    <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer inline-flex items-center">
      Upload
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden "
      />
      <ArrowDownTrayIcon className="w-5 h-5 text-white  ml-2" />
    </label>
  );
}

export default PDFUploader;

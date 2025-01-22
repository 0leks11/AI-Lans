import React, { useState } from "react";
import { usePdfContext } from "../context/pdfContext";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";

export function PdfUploader() {
  const { openPDF, closePDF } = usePdfContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0] as File;

      if (file && file.type === "application/pdf") {
        setSelectedFile(file);
        openPDF(file);
      }
    }
  };

  const handleCloseFile = () => {
    setSelectedFile(null);
    closePDF();
  };

  return (
    <div className="flex items-center w-full space-x-4">
      <label className="px-2 py-2 bg-blue-600/60 backdrop-blur text-white rounded hover:bg-blue-600 cursor-pointer inline-flex items-center">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <ArrowDownTrayIcon className="w-4 h-4 text-white" />
        <span></span>
      </label>

      {selectedFile && (
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center space-x-2 mr-4 truncate">
            <DocumentIcon className="w-4 h-4 text-gray-700" />
            <span className="text-sm text-gray-700 truncate overflow-hidden max-w-sm">
              {selectedFile.name}
            </span>
          </div>

          <button
            onClick={handleCloseFile}
            className="inline-flex items-center px-2 py-2 border border-slate-300 text-gray-800 bg-slate-200  hover:bg-slate-100 rounded"
          >
            <XMarkIcon className="w-4 h-4" />
            <span></span>
          </button>
        </div>
      )}
    </div>
  );
}

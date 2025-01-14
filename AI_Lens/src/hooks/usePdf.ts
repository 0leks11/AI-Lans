import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

if (import.meta.env.DEV) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "../../node_modules/pdfjs-dist/build/pdf.worker.mjs";
} else {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdf.worker.bundle.js";
}

export const usePdf = (pdfUrl: string) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise
      .then((loadedPdf) => {
        setPdfDoc(loadedPdf);
        setTotalPages(loadedPdf.numPages);
      })
      .catch(console.error);
  }, [pdfUrl]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return {
    pdfDoc,
    currentPage,
    totalPages,
    handlePrevPage,
    handleNextPage,
    canvasRef,
  };
};

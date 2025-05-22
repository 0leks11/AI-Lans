import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, OutlineNode } from "pdfjs-dist";

if (import.meta.env.DEV) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "../../node_modules/pdfjs-dist/build/pdf.worker.mjs";
} else {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdf.worker.bundle.js";
}

export const usePdf = (pdfUrl: string) => {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [outline, setOutline] = useState<OutlineNode[]>([]);
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

  const closePDF = () => {
    setPdfDoc(null);
    setCurrentPage(1);
    setTotalPages(0);
  };

  const openPDF = (file: File) => {
    file.arrayBuffer().then(async (arrayBuffer) => {
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      try {
        const newPdfDoc = await loadingTask.promise;
        setPdfDoc(newPdfDoc);
        setTotalPages(newPdfDoc.numPages);
        if (newPdfDoc) {
          try {
            const pdfOutline = await newPdfDoc.getOutline();
            setOutline(pdfOutline || []);
          } catch (e) {
            console.error("Error getting PDF outline:", e);
            setOutline([]); // Set to empty array on error
          }
        }
      } catch (error) {
        console.error("Ошибка открытия PDF:", error);
      }
    });
  };

  const navigateToPage = (pageNumber: number) => {
    if (pdfDoc && pageNumber > 0 && pageNumber <= pdfDoc.numPages) {
      setCurrentPage(pageNumber);
    } else {
      console.warn(`Invalid page number: ${pageNumber}`);
    }
  };

  const renderPageOffscreen = async (
    pageNum: number,
    scale: number = 1
  ): Promise<string> => {
    if (!pdfDoc) throw new Error("PDF не загружен");
    const page = await pdfDoc.getPage(pageNum);

    const offscreenCanvas = document.createElement("canvas");
    const ctx = offscreenCanvas.getContext("2d");
    if (!ctx) return "";

    const viewport = page.getViewport({ scale });
    const outputScale = window.devicePixelRatio || 1;

    offscreenCanvas.width = Math.floor(viewport.width * outputScale);
    offscreenCanvas.height = Math.floor(viewport.height * outputScale);

    const transform =
      outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : [1, 0, 0, 1, 0, 0];

    const renderContext = {
      canvasContext: ctx,
      transform,
      viewport,
    };

    await page.render(renderContext).promise;
    return offscreenCanvas.toDataURL("image/png");
  };

  return {
    pdfDoc,
    currentPage,
    totalPages,
    handlePrevPage,
    handleNextPage,
    canvasRef,
    renderPageOffscreen,
    closePDF,
    openPDF,
    outline,
    navigateToPage,
  };
};

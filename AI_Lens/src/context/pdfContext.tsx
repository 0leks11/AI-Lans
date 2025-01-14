import React, {
  RefObject,
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import * as pdfjsLib from "pdfjs-dist";

if (import.meta.env.DEV) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "../../node_modules/pdfjs-dist/build/pdf.worker.mjs";
} else {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdf.worker.bundle.js";
}

export interface IPDFContext {
  openPDF: (file: File) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  currentPage: number;
  totalPages: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

const pdfContext = createContext<IPDFContext | null>(null);

export const PDFProvider = ({ children }: React.PropsWithChildren) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const openPDF = useCallback((file: File) => {
    file.arrayBuffer().then(async (arrayBuffer) => {
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const loadedPdf = await loadingTask.promise;
      setPdfDoc(loadedPdf);
      setTotalPages(loadedPdf.numPages);
    });
  }, []);

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    if (!pdfDoc) return;
    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1 });

      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : [];

      const renderContext = {
        canvasContext: context,
        transform,
        viewport,
      };

      await page.render(renderContext).promise;
    };

    renderPage().catch(console.error);
  }, [pdfDoc, currentPage]);

  return (
    <pdfContext.Provider
      value={{
        openPDF,
        goToNextPage,
        goToPrevPage,
        currentPage,
        totalPages,
        canvasRef,
      }}
    >
      {children}
    </pdfContext.Provider>
  );
};

export const usePdf = () => {
  const context = useContext(pdfContext);
  if (!context) {
    throw new Error("usePdf must be used within a PDFProvider");
  }
  return context;
};

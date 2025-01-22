import React, {
  RefObject,
  createContext,
  useContext,
  useEffect,
  PropsWithChildren,
} from "react";
import type * as pdfjsLib from "pdfjs-dist";
import { usePdf } from "../hooks/usePdf";

export interface IPDFContext {
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  closePDF: () => void;
  openPDF: (file: File) => void;
  currentPage: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  renderPageOffscreen: (pageNum: number, scale?: number) => Promise<string>;
}

const pdfContext = createContext<IPDFContext | null>(null);

export const PDFProvider: React.FC<PropsWithChildren<{ pdfUrl: string }>> = ({
  children,
  pdfUrl,
}) => {
  const {
    pdfDoc,
    closePDF,
    openPDF,
    currentPage,
    totalPages,
    handlePrevPage,
    handleNextPage,
    canvasRef,
    renderPageOffscreen,
  } = usePdf(pdfUrl);

  useEffect(() => {
    if (!pdfDoc) return;
    (async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const desiredScale = 0.9;
        const viewport = page.getViewport({ scale: desiredScale });

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const transform =
          outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : [1, 0, 0, 1, 0, 0];

        const renderContext = {
          canvasContext: context,
          transform,
          viewport,
        };

        await page.render(renderContext).promise;
      } catch (e) {
        console.error("Ошибка при рендере текущей страницы:", e);
      }
    })();
  }, [pdfDoc, currentPage, canvasRef]);

  return (
    <pdfContext.Provider
      value={{
        pdfDoc,
        closePDF,
        openPDF,
        currentPage,
        totalPages,
        handlePrevPage,
        handleNextPage,
        canvasRef,
        renderPageOffscreen,
      }}
    >
      {children}
    </pdfContext.Provider>
  );
};

export const usePdfContext = () => {
  const context = useContext(pdfContext);
  if (!context) {
    throw new Error("usePdfContext must be used within a PDFProvider");
  }
  return context;
};

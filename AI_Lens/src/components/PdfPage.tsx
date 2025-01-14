import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

interface PdfPageProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  pageNumber: number;
  onCanvasRef: (canvas: HTMLCanvasElement) => void;
}

export const PdfPage: React.FC<PdfPageProps> = ({
  pdfDoc,
  pageNumber,
  onCanvasRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!pdfDoc) return;
    const renderPage = async () => {
      const page = await pdfDoc.getPage(pageNumber);
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
  }, [pdfDoc, pageNumber]);

  useEffect(() => {
    if (canvasRef.current) {
      onCanvasRef(canvasRef.current);
    }
  }, [pdfDoc, pageNumber, onCanvasRef]);

  return <canvas ref={canvasRef} className="border mb-4" />;
};

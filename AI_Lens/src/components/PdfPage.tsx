import React from "react";
import { usePdfContext } from "../context/pdfContext";
export const PdfPage: React.FC = () => {
  const { canvasRef } = usePdfContext();

  return <canvas ref={canvasRef} className="" />;
};

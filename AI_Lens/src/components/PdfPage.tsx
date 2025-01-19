import React from "react";
import { usePdf } from "../context/pdfContext";

export const PdfPage: React.FC = () => {
  const { canvasRef } = usePdf();

  return <canvas ref={canvasRef} className="" />;
};

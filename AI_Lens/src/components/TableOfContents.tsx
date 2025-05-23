import React from 'react';
import { usePdfContext } from '../context/pdfContext';

// Re-defining TableOfContentsProps in case we want to use it later, but component won't use props explicitly yet.
interface TableOfContentsProps {}

const TableOfContents = () => { // Removed React.FC for now
  const { outline, navigateToPage, pdfDoc } = usePdfContext(); // Added back context hook

  if (!pdfDoc) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Load a PDF to see its table of contents.
      </div>
    );
  }

  if (!outline || outline.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No table of contents found in this PDF.
      </div>
    );
  }

  // Placeholder for actual outline rendering
  return (
    <div className="w-64 h-full bg-slate-50 border-r border-slate-300 overflow-y-auto p-4">
      <h3 className="text-lg font-semibold mb-3 text-slate-700">Table of Contents</h3>
      <div id="toc-placeholder">
        {/* Actual outline items will go here in a later step */}
        <p className="text-sm text-slate-400">Outline will be rendered here.</p>
      </div>
    </div>
  );
};

export default TableOfContents;

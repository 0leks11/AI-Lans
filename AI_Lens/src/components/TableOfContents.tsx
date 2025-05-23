import React from 'react';
import { usePdfContext } from '../context/pdfContext';

const TableOfContents = () => {
  const { outline, pdfDoc } = usePdfContext(); // navigateToPage is still temporarily removed

  // The renderOutlineNodes function (recursive)
  const renderOutlineNodes = (nodes: any[] | undefined, level = 0): React.ReactNode[] => {
    if (!nodes) return [];
    return nodes.map((node, index) => (
      // Using <div> instead of <React.Fragment> or <li> for now as a precaution
      <div key={`${level}-${index}-${node.title}`}>
        <div
          style={{ marginLeft: `${level * 20}px` }}
          className="py-1 px-2 hover:bg-slate-200 rounded cursor-default" // cursor-default as no click yet
        >
          {node.title}
        </div>
        {node.items && node.items.length > 0 && (
          // Using <div> instead of <ul>
          <div>{renderOutlineNodes(node.items, level + 1)}</div>
        )}
      </div>
    ));
  };

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

  return (
    <div className="w-64 h-full bg-slate-50 border-r border-slate-300 overflow-y-auto p-4">
      <h3 className="text-lg font-semibold mb-3 text-slate-700">Table of Contents</h3>
      {/* Replace placeholder with actual rendering logic */}
      <div> {/* This div acts like the main <ul> */}
        {renderOutlineNodes(outline)}
      </div>
    </div>
  );
};

export default TableOfContents;

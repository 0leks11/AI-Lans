import React from 'react';
import { usePdfContext } from '../context/pdfContext';

const TableOfContents = () => {
  const { outline, navigateToPage, pdfDoc } = usePdfContext();

  const handleTocItemClick = async (item: any) => {
    // ... (existing function)
    if (!pdfDoc || !navigateToPage) return; 
    if (item.dest && typeof item.dest === 'string') {
      try {
        const destArray = await pdfDoc.getDestination(item.dest);
        if (destArray && destArray[0]) {
          const pageRef = destArray[0];
          const pageIndex = await pdfDoc.getPageIndex(pageRef);
          navigateToPage(pageIndex + 1);
        } else {
          console.warn('Destination string did not resolve:', item.dest);
        }
      } catch (e) {
        console.error('Error resolving string destination:', e);
      }
    } else if (item.dest && Array.isArray(item.dest) && item.dest[0]) {
      try {
        const pageRef = item.dest[0];
        const pageIndex = await pdfDoc.getPageIndex(pageRef);
        navigateToPage(pageIndex + 1);
      } catch (e) {
        console.error('Error resolving array destination:', e);
      }
    } else {
      console.warn('Table of Contents item has no valid destination:', item);
    }
  };

  const renderOutlineNodes = (nodes: any[] | undefined, level = 0): React.ReactNode[] => {
    // ... (existing function)
    if (!nodes) return [];
    return nodes.map((node, index) => (
      <div key={`${level}-${index}-${node.title}`}>
        <div
          style={{ marginLeft: `${level * 20}px` }}
          className="py-1 px-2 hover:bg-slate-200 rounded cursor-pointer"
          onClick={() => handleTocItemClick(node)}
        >
          {node.title}
        </div>
        {node.items && node.items.length > 0 && (
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
    // Main container: make it a flex column, remove its own overflow-y-auto if present from earlier versions
    <div className="w-64 h-full bg-slate-50 border-r border-slate-300 p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-slate-700 flex-shrink-0"> {/* Title: prevent shrinking */}
        Table of Contents
      </h3>
      {/* List container: make it grow and scroll its content */}
      <div className="flex-grow overflow-y-auto"> 
        {renderOutlineNodes(outline)}
      </div>
    </div>
  );
};

export default TableOfContents;

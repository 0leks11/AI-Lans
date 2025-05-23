import React from 'react';
import { usePdfContext } from '../context/pdfContext';
// OutlineNode import removed

interface TableOfContentsProps {
  // No props needed, will get everything from context
}

const TableOfContents = () => { // React.FC<TableOfContentsProps> removed
  const { outline, navigateToPage, pdfDoc } = usePdfContext();

  if (!pdfDoc) {
    return <div className="p-4 text-sm text-gray-500">Load a PDF to see its table of contents.</div>;
  }

  if (!outline || outline.length === 0) {
    return <div className="p-4 text-sm text-gray-500">No table of contents found in this PDF.</div>;
  }

  const handleTocItemClick = async (item: any) => { // Changed to any
    // Using the simplified version from the current subtask description
    if (item.dest && typeof item.dest === 'string') {
      const destArray = await pdfDoc.getDestination(item.dest);
      if (destArray && destArray[0]) {
        const pageRef = destArray[0];
        const pageIndex = await pdfDoc.getPageIndex(pageRef);
        navigateToPage(pageIndex + 1); 
      }
    } else if (item.dest && Array.isArray(item.dest) && item.dest[0]) {
      const pageRef = item.dest[0];
      const pageIndex = await pdfDoc.getPageIndex(pageRef);
      navigateToPage(pageIndex + 1);
    } else {
      console.warn('Table of Contents item has no valid destination:', item);
    }
  };

  const renderOutlineNodes = (nodes: any[] | undefined, level = 0): JSX.Element[] => { // Changed to any[]
    if (!nodes) return [];
    return nodes.map((node, index) => (
      <div key={`${level}-${index}-${node.title}`}> {/* Replaced React.Fragment with div */}
        <li
          style={{ marginLeft: `${level * 20}px` }}
          className="py-1 px-2 hover:bg-slate-200 cursor-pointer rounded" // As per current subtask
          onClick={() => handleTocItemClick(node)}
          // title attribute omitted as per current subtask
        >
          {node.title}
        </li>
        {node.items && node.items.length > 0 && (
          // No specific class for nested ul as per current subtask
          <ul>{renderOutlineNodes(node.items, level + 1)}</ul>
        )}
      </div> // Replaced React.Fragment with div
    ));
  };

  return (
    <div className="w-64 h-full bg-slate-50 border-r border-slate-300 overflow-y-auto p-4">
      <h3 className="text-lg font-semibold mb-3 text-slate-700">Table of Contents</h3>
      <ul className="space-y-1 text-sm text-slate-600">
        {renderOutlineNodes(outline)}
      </ul>
    </div>
  );
};

export default TableOfContents;

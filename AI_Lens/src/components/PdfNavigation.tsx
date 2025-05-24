import React from 'react';
import { PdfNavigationButton } from './PdfNavigationButton';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUturnRightIcon, // Clockwise
  ArrowUturnLeftIcon,  // Counter-clockwise
} from '@heroicons/react/24/outline';
import { usePdfContext } from '../context/pdfContext'; // Adjust path as needed

interface PdfNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  // Rotation functions are now taken from context within the component
}

export const PdfNavigation: React.FC<PdfNavigationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  const { rotateClockwise, rotateCounterClockwise, pdfDoc } = usePdfContext();

  return (
    <div className="flex items-center justify-center gap-3 my-4 bg-slate-100 p-2 rounded-full shadow"> {/* Added some styling to parent */}
      <PdfNavigationButton
        onClick={onPrevPage}
        disabled={currentPage <= 1 || !pdfDoc}
        icon={
          <ArrowLeftIcon className="text-slate-600 stroke-[2] h-5 w-5 transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
        }
        tooltip="Previous Page"
      />

      <span className="px-2 text-slate-600 font-medium text-sm"> {/* Styled page numbers */}
        {pdfDoc ? `${currentPage} / ${totalPages}` : "- / -"}
      </span>

      <PdfNavigationButton
        onClick={onNextPage}
        disabled={currentPage >= totalPages || !pdfDoc}
        icon={
          <ArrowRightIcon className="text-slate-600 stroke-[2] h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        }
        tooltip="Next Page"
      />

      {/* Separator (optional) */}
      {pdfDoc && <div className="h-5 w-px bg-slate-300 mx-1"></div>}

      <PdfNavigationButton
        onClick={rotateCounterClockwise}
        disabled={!pdfDoc}
        icon={
          <ArrowUturnLeftIcon className="text-slate-600 stroke-[2] h-5 w-5 transition-transform duration-300 ease-in-out group-hover:-rotate-12" />
        }
        tooltip="Rotate Counter-Clockwise"
      />

      <PdfNavigationButton
        onClick={rotateClockwise}
        disabled={!pdfDoc}
        icon={
          <ArrowUturnRightIcon className="text-slate-600 stroke-[2] h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-12" />
        }
        tooltip="Rotate Clockwise"
      />
    </div>
  );
};

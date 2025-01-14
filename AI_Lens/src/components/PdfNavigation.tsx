import React from "react";
import { ActiveButton } from "./ActiveButton";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface PdfNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const PdfNavigation: React.FC<PdfNavigationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="flex gap-2 my-4">
      <ActiveButton
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        icon={
          <ArrowLeftIcon className="self-start text-slate-500 stroke-[2] h-6 w-6 ml-3 transition-transform duration-500 ease-in-out group-hover:-translate-x-2" />
        }
      />

      <span className="px-2">
        {currentPage} / {totalPages}
      </span>

      <ActiveButton
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        icon={
          <ArrowRightIcon className="self-end text-slate-500 stroke-[2] h-6 w-6 ml-3 transition-transform duration-500 ease-in-out group-hover:translate-x-2" />
        }
      />
    </div>
  );
};

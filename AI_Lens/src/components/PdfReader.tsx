import React, { useEffect } from "react";
import interact from "interactjs";
import { usePdf } from "./hooks/usePdf";
import { PdfNavigation } from "./PdfNavigation";
import { PdfPage } from "./PdfPage";
import { useOpenAI } from "./hooks/useOpenAI";
import { SendButton } from "./SendButton";
import { Collapsible } from "./Collapsible";

export const PdfReader = () => {
  const {
    pdfDoc,
    currentPage,
    totalPages,
    handlePrevPage,
    handleNextPage,
    handleCanvasRef,
    pdfCanvas,
  } = usePdf("/Ge.pdf");

  const { responseHtml, sendToOpenAI } = useOpenAI();

  const handleSendToOpenAI = () => {
    if (pdfCanvas) {
      sendToOpenAI(pdfCanvas);
    } else {
      console.error("Canvas is not ready");
    }
  };

  useEffect(() => {
    // Функция-слушатель перемещения
    function dragMoveListener(event: any) {
      const target = event.target as HTMLElement;
      const x =
        (parseFloat(target.getAttribute("data-x") ?? "0") || 0) + event.dx;
      const y =
        (parseFloat(target.getAttribute("data-y") ?? "0") || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute("data-x", x.toString());
      target.setAttribute("data-y", y.toString());
    }

    interact(".draggable").draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      autoScroll: true,
      listeners: {
        move: dragMoveListener,
      },
    });

    window.dragMoveListener = dragMoveListener;

    return () => {
      interact(".draggable").unset();
    };
  }, []); //

  return (
    <section className=" text-white max-w-7xl mx-auto rounded-lg mt-6 mb-6 p-8">
      <div className="flex bg-slate-100 flex-row md:flex-row rounded-lg p-2">
        <div className="flex flex-col md:w-1/2 md:pr-8 ml-4 mb-2">
          <PdfPage
            pdfDoc={pdfDoc}
            pageNumber={currentPage}
            onCanvasRef={handleCanvasRef}
          />{" "}
          <div className="relative flex items-center h-full">
            <div className="absolute left-1/2 transform -translate-x-1/2 text-slate-500">
              <PdfNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
              />
            </div>

            <div className="ml-auto">
              <SendButton onClick={handleSendToOpenAI} />
            </div>
          </div>
        </div>

        <div className="draggable border border-white/25  bg-blue-600/60 backdrop-blur flex flex-col md:w-1/2 ml-4 bg-blue-300 rounded-lg mb-16 p-4">
          <div className="Box  border-blue-500 rounded-md ">
            <div dangerouslySetInnerHTML={{ __html: responseHtml }} />
          </div>
        </div>
      </div>
    </section>
  );
};

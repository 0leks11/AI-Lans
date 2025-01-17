import React, { useCallback, useEffect } from "react";
import interact from "interactjs";
import { usePdf } from "../context/pdfContext";
import { PdfNavigation } from "./PdfNavigation";
import { PdfPage } from "./PdfPage";
import { ReUseButton } from "./ReUseButton";
import { Collapsible } from "./Collapsible";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useOpenAIContext } from "../context/OpenAIContext";
import PdfUploader from "./PdfUploader";

export const PdfReader = () => {
  const { currentPage, totalPages, canvasRef, goToNextPage, goToPrevPage } =
    usePdf();

  const { responseHtml, sendToOpenAI, userPrompt, setUserPrompt } =
    useOpenAIContext();

  const handleSendToOpenAI = useCallback(() => {
    if (canvasRef.current) {
      sendToOpenAI(canvasRef.current);
    } else {
      console.error("Canvas is not ready");
    }
  }, [canvasRef, sendToOpenAI]);

  useEffect(() => {
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
  }, []);

  return (
    <section className="text-white bg-slate-100 max-h-full max-w-7xl mx-auto rounded-lg mt-6 mb-6 p-8 ">
      <div className="flex bg-slate-100 flex-row md:flex-row rounded-lg p-2 ">
        <div className="flex flex-col md:w-1/2 md:pr-8 ml-4 min-h-80 mb-2">
          <PdfPage />
          <div className="relative flex items-center">
            <div className="mr-auto">
              <PdfUploader />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 text-slate-500">
              <PdfNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={goToPrevPage}
                onNextPage={goToNextPage}
              />
            </div>

            <div className="ml-auto">
              <ReUseButton
                onClick={handleSendToOpenAI}
                button={<p>AI Lens</p>}
              />
            </div>
          </div>
        </div>

        <div className="draggable flex  flex-col  border border-white/25 bg-blue-600/60  backdrop-blur md:w-1/2  ml-4 bg-blue-00 rounded-lg mb-16 p-4 p-2">
          <div className="Box border-blue-900 rounded-md justify-between flex flex-col ">
            <div className="">
              <div className="flex flex-row p-2">
                <SparklesIcon className="w-5 h-5 text-white mt-1" />
                <div className="text-white text-lg font-semibold ml-1">
                  Right AI reader
                </div>
              </div>

              <div>
                <div className="flex  max-h-[650px] overflow-y-auto">
                  <div
                    className="space-y-4 p-2"
                    dangerouslySetInnerHTML={{ __html: responseHtml }}
                  />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 px-4 mb-2 w-full">
                <Collapsible
                  button={
                    <p className="flex self-end justify-between bg-white text-gray-500 font-medium mx-2 rounded-full shadow hover:bg-gray-100 hover:text-gray-400 transition px-4  py-2 cursor-pointer">
                      <span>Prompt</span>
                      <ArrowUpRightIcon className="w-5 h-5 ml-6 stroke-[2] text-gray-500" />
                    </p>
                  }
                  content={
                    <div className=" mt-3 prompt-editor">
                      <textarea
                        id="prompt"
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        rows={5}
                        className="w-full text-black p-2 border backdrop-blur-md shadow-lg rounded-lg bg-sky-100"
                      />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useCallback, useEffect } from "react";
import interact from "interactjs";
import { usePdfContext } from "../context/pdfContext";
import { PdfNavigation } from "./PdfNavigation";
import { PdfPage } from "./PdfPage";
import { ReUseButton } from "./ReUseButton";
import { Collapsible } from "./Collapsible";
import { useOpenAIContext } from "../context/OpenAIContext";
import { PdfUploader } from "./PdfUploader";

import {
  ArrowUpRightIcon,
  SparklesIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

export const PdfReader = () => {
  const { currentPage, totalPages, handleNextPage, handlePrevPage } =
    usePdfContext();

  const {
    getPageAIResponse,
    aiLensActive,
    setAiLensActive,
    userPrompt,
    setUserPrompt,
  } = useOpenAIContext();

  const responseHtml =
    getPageAIResponse(currentPage) || "<p>is thinking...</p>";

  const toggleAILens = useCallback(() => {
    setAiLensActive((prev) => !prev);
  }, [setAiLensActive]);

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
    <section className="flex justify-center items-center min-h-screen bg-slate-100 p-8">
      <div className="flex bg-slate-100 flex-row rounded-lg p-2">
        <div className="flex flex-col min-w-[550px] min-h-[700px] md:pr-8 ml-4 mb-2">
          <div className="flex flex-row mb-1 justify-between ">
            <div>
              <PdfUploader />
            </div>
            <div className="relative Box top-0 left-0 z-30 px-6 mb-2">
              <Collapsible
                button={
                  <div className="absolute top-0 right-0 z-50 flex flex-row text-blue-500 font-medium rounded-full transition cursor-pointer">
                    <ReUseButton
                      onClick={toggleAILens}
                      button={<p className="">{aiLensActive}</p>}
                      icon={
                        <SparklesIcon className="w-8 h-8 px-1 py-1 border border-slate-300 text-blue-600/60 text-backdrop-blur bg-slate-200  hover:bg-slate-100 rounded" />
                      }
                    />
                  </div>
                }
                directionAbove={false}
                content={
                  <div className="draggable Box min-w-[555px] absolute text-white top-full left-0 z-40 border-blue-900 rounded-md justify-between flex w-full flex-col border border-white/25 bg-blue-700/50 backdrop-blur md:w-1/2 rounded-lg shadow-lg">
                    <div>
                      <p className="flex flex-row text-xl font-bold pt-4 px-5">
                        <SparklesIcon className="w-5 h-5 text-white mr-1 mt-1" />
                        Right AI reader
                      </p>
                      <div
                        className="Box space-y-4 p-4 mb-16 mt-2 min-h-[635px] max-h-[612px] overflow-y-auto mb-8 paragraph-container"
                        dangerouslySetInnerHTML={{ __html: responseHtml }}
                      />

                      <div className="absolute bottom-0 left-0 px-4 mb-2 w-full">
                        <Collapsible
                          button={
                            <p className="flex self-end justify-between bg-white text-gray-500 font-medium rounded-full shadow hover:bg-gray-100 hover:text-gray-400 transition px-4 py-2 cursor-pointer">
                              <span>Prompt</span>
                              <ArrowUpRightIcon className="w-5 h-5 ml-6 mt-1 stroke-[2] text-gray-500" />
                            </p>
                          }
                          directionAbove={true}
                          content={
                            <div className="mt-3 prompt-editor">
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
                      <div className="absolute bottom-0 right-0 px-4 mb-4 mr-4 flex self-end justify-between bg-white text-gray-500 font-medium mx-2 rounded-full shadow hover:bg-gray-100 hover:text-gray-400 transition px-4 py-2 cursor-pointer">
                        <ReUseButton
                          onClick={toggleAILens}
                          button={<p>AI Lens</p>}
                        />
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          <div className="border mb-4 item-cente min-w-[550px] min-h-[700px]">
            <PdfPage />
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 text-slate-500">
              <PdfNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

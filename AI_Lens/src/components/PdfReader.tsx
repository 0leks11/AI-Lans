import React, { useCallback, useEffect, useState } from "react"; // Added useState
import interact from "interactjs";
import { usePdfContext } from "../context/pdfContext";
import { PdfNavigation } from "./PdfNavigation";
import { PdfPage } from "./PdfPage";
import { ReUseButton } from "./ReUseButton";
import { Collapsible } from "./Collapsible";
import { useOpenAIContext } from "../context/OpenAIContext";
import { useAIContext } from "../context/AIContext";
import { PdfUploader } from "./PDFUploader";
import { ArrowUpRightIcon, SparklesIcon } from "@heroicons/react/24/solid";
import TableOfContents from "./TableOfContents";
import TocToggleButton from "./TocToggleButton"; // Import the new button

export const PdfReader = () => {
  const { currentPage, totalPages, handleNextPage, handlePrevPage } =
    usePdfContext();

  // State for ToC sidebar visibility
  const [isTocOpen, setIsTocOpen] = useState(true); // Sidebar is open by default

  const toggleTocSidebar = () => {
    setIsTocOpen(prev => !prev);
  };

  const { isConnected } = useOpenAIContext();
  const {
    getPageAIResponse,
    aiLensActive,
    setAiLensActive,
    userPrompt,
    setUserPrompt,
    sendCurrentPage,
  } = useAIContext();

  const responseHtml =
    getPageAIResponse(currentPage) || "<p>is thinking...</p>";

  const handleSendCurrentPage = useCallback(async () => {
    await sendCurrentPage(currentPage);
  }, [sendCurrentPage, currentPage]);

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
    <section className="flex justify-center items-start min-h-screen bg-slate-100 p-8">
      <div className="flex flex-row bg-white shadow-xl rounded-lg overflow-hidden relative"> {/* Added relative */}
        
        {/* Sidebar container with transition for width */}
        <div className={`transition-all duration-300 ease-in-out ${isTocOpen ? 'w-64' : 'w-0'}`} style={{ overflow: 'hidden' }}>
          {isTocOpen && <TableOfContents />}
        </div>

        {/* PDF Viewer Column */}
        <div className="flex-grow transition-all duration-300 ease-in-out"> {/* Added transition classes */}
          {/* The rest of the PDF viewer content */}
          {/* Button's old wrapper div "absolute top-4 left-4 z-20" is removed from here */}
          <div className="flex flex-col min-w-[550px] min-h-[700px] p-4 md:pr-8">
            <div className="flex flex-row justify-between items-center mb-4">
              <div>
                <PdfUploader />
              </div>
            {isConnected && (
              <div className="relative z-30">
                <Collapsible
                  button={
                    <div className="relative flex justify-end z-50 text-blue-500 font-medium rounded-full transition cursor-pointer">
                      <ReUseButton
                        onClick={toggleAILens}
                        button={<p className="">{aiLensActive ? "AI Lens Active" : "AI Lens"}</p>} // More descriptive text
                        icon={
                          <SparklesIcon className="w-8 h-8 px-1 py-1 border border-slate-300 text-blue-600/60 bg-slate-200 hover:bg-slate-100 rounded" />
                        }
                      />
                    </div>
                  }
                  directionAbove={false}
                  content={
                    <div className="draggable absolute top-full right-0 w-[552px] z-40 text-white border-blue-900 rounded-md flex border border-white/25 bg-blue-700/50 backdrop-blur shadow-lg">
                      {/* ... AI Lens content ... */} {/* Corrected JSX Comment */}
                      <div>
                        <p className="flex flex-row text-xl font-bold pt-4 px-5">
                          <SparklesIcon className="w-5 h-5 text-white mr-1 mt-1" />
                          Right AI reader
                        </p>
                        <div
                          className="Box space-y-2 p-4 mt-2 min-h-[600px] max-h-[600px] overflow-y-auto mb-8 paragraph-container"
                          dangerouslySetInnerHTML={{ __html: responseHtml }}
                        />
                        <p className="p-4 px-5"></p>

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
                                  onChange={(e) =>
                                    setUserPrompt(e.target.value)
                                  }
                                  rows={5}
                                  className="w-full text-black p-2 border backdrop-blur-md shadow-lg rounded-lg bg-sky-100"
                                />
                              </div>
                            }
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 px-4 mb-4 mr-4 flex self-end justify-between bg-white text-gray-500 font-medium mx-2 rounded-full shadow hover:bg-gray-100 hover:text-gray-400 transition px-4 py-2 cursor-pointer">
                          <ReUseButton
                            onClick={handleSendCurrentPage}
                            button={<p>AI Lens</p>}
                          />
                        </div>
                      </div>
                    </div> {/* This closes the div started on line 115 */}
                  }
                />
              </div>
            )}
          </div>

          <div className="border item-center rounded-md min-w-[550px] min-h-[700px] flex justify-center items-center bg-slate-50"> {/* Added flex justify-center items-center bg-slate-50 for centering canvas */}
            <PdfPage />
          </div>

          <div className="relative flex items-center mt-4"> {/* Added mt-4 for spacing */}
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

        {/* Toggle Button - Positioned absolutely relative to the main container */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ease-in-out"
          style={{ 
            left: isTocOpen ? 'calc(16rem - 1.25rem)' : '0.5rem' 
            // 16rem is w-64. 1.25rem is approx half of a typical 2.5rem button width.
            // When closed, left is 0.5rem making it stick out slightly from the left edge.
          }}
        >
          <TocToggleButton isOpen={isTocOpen} onClick={toggleTocSidebar} />
        </div>

      </div>
    </section>
  );
};

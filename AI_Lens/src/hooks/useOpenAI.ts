import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import OpenAI from "openai";
import { usePdfContext } from "../context/pdfContext";

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export const useOpenAI = () => {
  const [pageResponses, setPageResponses] = useState<Record<number, string>>(
    {}
  );

  const [aiLensActive, setAiLensActive] = useState(false);

  const [userPrompt, setUserPrompt] = useState<string>(`
These contain information that the user does not understand. Your task is to analyze the content of the images and provide a clear 
explanation for each page. The information from each image-page should be divided into separate paragraphs. Capture the overall context 
of all uploaded image-pages and formulate the response as follows:
	The information from the first image-page card should be processed in the context of all the pages and displayed in the first paragraph.
If an image contains multiple ideas or statements, separate them. Your response must not contradict the author’s explanations but should 
complement the text written by the author. Continue the narrative in the same style as the author. Do not add your own commentary, and 
do not use headings or introductory words. Provide the information separated by paragraphs. Within each paragraph, start a new thought on a new line.
If the page contains only a few lines of text, there may not be much to add. However, if the page contains substantial information and 
ideas that the author intended to convey, focus on those. Attempt to thoughtfully analyze the content and the author’s ideas, providing 
subsequent explanations. Even if this makes the analysis of the page and its ideas quite extensive, give it the necessary attention.
  `);

  const requestedPagesRef = useRef<Set<number>>(new Set());

  const { pdfDoc, currentPage, totalPages, renderPageOffscreen } =
    usePdfContext();

  const fetchAIForPage = async (base64Image: string): Promise<string> => {
    const contentArray = [
      { type: "text", text: userPrompt },
      { type: "image_url", image_url: { url: base64Image } },
    ];
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: contentArray,
          },
        ],
      });
      const content = response?.choices?.[0]?.message?.content;
      if (!content) return "";
      const markdown = marked.parse(content);
      return typeof markdown === "string" ? markdown : "";
    } catch (err) {
      console.error("Error to request OpenAI:", err);
      return "";
    }
  };

  const preloadPageAI = async (pageNum: number) => {
    if (!pdfDoc) return;
    if (requestedPagesRef.current.has(pageNum)) return;
    if (pageNum < 1 || pageNum > totalPages) return;

    requestedPagesRef.current.add(pageNum);

    try {
      const base64 = await renderPageOffscreen(pageNum, 1);
      const aiHTML = await fetchAIForPage(base64);
      setPageResponses((prev) => ({ ...prev, [pageNum]: aiHTML }));
    } catch (e) {
      console.error("preloadPageAI error:", e);
    }
  };

  const getPageAIResponse = (pageNum: number): string | undefined => {
    return pageResponses[pageNum];
  };

  useEffect(() => {
    if (!pdfDoc || !aiLensActive) return;
    (async () => {
      await preloadPageAI(currentPage);
      await preloadPageAI(currentPage + 1);
      await preloadPageAI(currentPage + 2);
    })();
  }, [pdfDoc, currentPage, aiLensActive]);

  return {
    userPrompt,
    setUserPrompt,
    getPageAIResponse,
    aiLensActive,
    setAiLensActive,
    pageResponses,
    preloadPageAI,
  };
};

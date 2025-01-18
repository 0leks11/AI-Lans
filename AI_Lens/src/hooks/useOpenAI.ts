import { useState } from "react";
import { marked } from "marked";
import OpenAI from "openai";
import { usePdf } from "../context/pdfContext";
import type * as pdfjsLib from "pdfjs-dist";

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export const useOpenAI = () => {
  const [responseHtml, setResponseHtml] = useState<string>("");

  const [userPrompt, setUserPrompt] = useState<string>(
    `These images contain information that the user does not understand. Your task is to analyze the content of the images and provide a clear explanation for each page. The information from each image-page should be divided into separate paragraphs. Capture the overall context of all uploaded image-pages and formulate the response as follows:
	•	The information from the first image-page card should be processed in the context of all the pages and displayed in the first paragraph.
	•	The information from the second image-page should also be processed with the overall context of all pages and displayed in the second paragraph.
	•	The information from the third image-page, along with the general context of all pages, should be processed and presented in a separate third paragraph.

If an image contains multiple ideas or statements, separate them. Your response must not contradict the author’s explanations but should complement the text written by the author. Continue the narrative in the same style as the author. Do not add your own commentary, and do not use headings or introductory words. Provide the information separated by paragraphs. Within each paragraph, start a new thought on a new line.

If the page contains only a few lines of text, there may not be much to add. However, if the page contains substantial information and ideas that the author intended to convey, focus on those. Attempt to thoughtfully analyze the content and the author’s ideas, providing subsequent explanations. Even if this makes the analysis of the page and its ideas quite extensive, give it the necessary attention.`
  );

  const { pdfDoc, currentPage, totalPages } = usePdf();

  const renderPageToBase64 = async (
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNumber: number
  ): Promise<string> => {
    const page = await pdf.getPage(pageNumber);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const viewport = page.getViewport({ scale: 1 });
    const outputScale = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);

    const renderContext = {
      canvasContext: ctx,

      transform:
        outputScale !== 1
          ? [outputScale, 0, 0, outputScale, 0, 0]
          : [1, 0, 0, 1, 0, 0],
      viewport,
    };

    await page.render(renderContext).promise;
    return canvas.toDataURL("image/png");
  };

  const getFivePagesBase64 = async (): Promise<string[]> => {
    if (!pdfDoc) return [];

    const images: string[] = [];
    for (let i = 0; i < 3; i++) {
      const pageNum = currentPage + i;
      if (pageNum <= totalPages) {
        const base64 = await renderPageToBase64(pdfDoc, pageNum);
        if (base64) images.push(base64);
      } else {
        break;
      }
    }
    return images;
  };

  const sendToOpenAI = async () => {
    try {
      if (!pdfDoc) {
        console.error("PDF Document is not loaded yet.");
        return;
      }

      const base64Images = await getFivePagesBase64();
      if (base64Images.length === 0) {
        console.error("No images were rendered.");
        return;
      }

      const contentArray = [
        {
          type: "text",
          text: userPrompt,
        },
        ...base64Images.map((img) => ({
          type: "image_url",
          image_url: { url: img },
        })),
      ];

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
      if (content) {
        const markdown = marked.parse(content);
        if (typeof markdown === "string") {
          setResponseHtml(markdown);
        }
      }
    } catch (err) {
      console.error("Error to request OpenAI:", err);
    }
  };

  const handleResponse = async () => {
    await sendToOpenAI();
  };

  return {
    responseHtml,
    sendToOpenAI,
    handleResponse,
    userPrompt,
    setUserPrompt,
  };
};

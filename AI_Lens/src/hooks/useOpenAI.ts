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
    `This image contains information that the user does not understand. Your task is to analyze the content of the image and provide a clear explanation. If the page contains multiple thoughts or statements, separate them. Your response should not contradict the author's explanations but should complement the text written by the author. Continue the narrative in the same style as the author. Do not add commentary from yourself, but do not use headings or introductory words.Send me information, separating it with paragraph spacing. Each interval should divide the content retrieved from each page.`
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
    for (let i = 0; i < 5; i++) {
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

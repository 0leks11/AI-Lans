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
    `Эти изображения содержат информацию, которую пользователь не понимает. Ваша задача — проанализировать содержимое изображений и предоставить четкое объяснение
     постранично. Информация с каждого изображения-страницы должна быть разделена по разным параграфам. Уловите общий контекст всех загруженных изображений-страниц и сформулируйте ответ так, чтобы:
      Информация, полученная с первой карточки страницы фотографии, была обработана с учётом общего контекста всех страниц и отображена в первом параграфе.
      Информация со второго изображения-страницы была также обработана с учётом контекста всех страниц и отображена во втором параграфе.
      Информация с третьей карточки страницы вместе с общим контекстом всех страниц была обработана и представлена в отдельном третьем параграфе.
      Если на изображении представлены несколько мыслей или утверждений, разделите их. Ваш ответ не должен противоречить объяснениям автора,
       а должен дополнять текст, написанный автором. Продолжайте повествование в том же стиле, что и у автора. Не добавляйте комментарии от себя и не используйте заголовки или вводные слова. Отправьте информацию, разделяя её абзацами. Внутри каждого абзаца начинайте новую мысль с новой строки.Если на странице указано несколько строп текста, в этом случае действительно тут нечего больше добавить. Но если на этой странице книги довольно много информации и мыслей, которые хотел передать автор, на этом стоит заострить внимание И попытаться вдумчиво провести разбор содержимого и мыслей с последующим объяснением мыслей автора.Даже если из-за этого разбор страницы и мыслей станет довольно объемным. `
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

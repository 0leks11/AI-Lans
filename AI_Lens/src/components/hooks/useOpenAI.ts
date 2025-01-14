import { useState } from "react";
import { marked } from "marked";
import OpenAI from "openai";

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: "sk-",
});

export const useOpenAI = () => {
  const [responseHtml, setResponseHtml] = useState("");
  const sendToOpenAI = async (canvas?: HTMLCanvasElement) => {
    if (!canvas) return;
    const base64Image = canvas.toDataURL();
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `This image contains information that the user does not understand. Your task is to analyze the content of the image and provide a clear explanation.  If the page contains multiple thoughts or statements, separate them. Your response should not contradict the author's explanations but should complement the text written by the author. Continue the narrative in the same style as the author. Do not add commentary from yourself, but do not use headings or introductory words.`,
              },
              {
                type: "image_url",
                image_url: { url: base64Image },
              },
            ],
          },
        ],
      });

      const content = response?.choices?.[0]?.message?.content;
      if (content) {
        const markdown = marked.parse(content);
        setResponseHtml(markdown);
      }
    } catch (err) {
      console.error("Error to request OpenAI:", err);
    }
  };

  return {
    responseHtml,
    sendToOpenAI,
  };
};

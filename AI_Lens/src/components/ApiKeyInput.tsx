import React, { useState, useRef } from "react";
import { useOpenAIContext } from "../context/OpenAIContext";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { setOpenAIKey, isConnected } = useOpenAIContext();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowInfo(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowInfo(false);
    }, 300);
  };

  const validateApiKey = (key: string) => {
    if (!key.trim()) {
      return "API key cannot be empty";
    }
    if (!key.startsWith("sk-")) {
      return "API key must start with 'sk-'";
    }
    if (key.length < 20) {
      return "API key is too short";
    }
    return null;
  };

  const handleConnect = () => {
    const validationError = validateApiKey(apiKey);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setOpenAIKey(apiKey);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setError(null);
  };

  return (
    <div className="flex flex-col space-y-4 p-6 bg-white rounded-md shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Connecting to OpenAI
        </h2>
        <div className="relative">
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <QuestionMarkCircleIcon className="w-6 h-6" />
          </button>
          {showInfo && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white p-4 rounded-md shadow-lg border border-gray-200 z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <p className="text-sm text-gray-600 mb-2">
                Your API key is secure! We do not save or transfer your data to
                third parties.
              </p>
              <p className="text-sm text-gray-600 mb-2">
                All code is open and available in our GitHub repository, where
                you can see the safety of data processing.
              </p>
              <a
                href="https://github.com/0leks11/AI-Lans"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                View code in: 0leks11/AI-Lans
              </a>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        For using AI functions, please enter your OpenAI API key.
        <br />
      </p>
      <div className="flex flex-row gap-4">
        <div className="flex-grow">
          <input
            type="password"
            value={apiKey}
            onChange={handleKeyChange}
            placeholder="Enter your OpenAI API key"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        <button
          onClick={handleConnect}
          disabled={isConnected || !apiKey.trim()}
          className={`w-[25%] px-4 py-2 text-white rounded-md transition-colors duration-200 ${
            isConnected
              ? "bg-green-600 cursor-not-allowed"
              : !apiKey.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isConnected ? "Connected" : "Connect"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

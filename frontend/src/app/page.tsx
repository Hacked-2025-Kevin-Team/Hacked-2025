"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define a type for tool research items
type ToolResearchItem = {
  url: string;
  description: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [toolResearch, setToolResearch] = useState<ToolResearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to check if value looks like tool research message.
  // In this example we assume it begins and ends with curly braces and contains "http".
  const tryParseToolResearch = (text: string): ToolResearchItem[] | null => {
    const trimmed = text.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}") && trimmed.includes("http")) {
      try {
        // Since our Python representation may use single quotes,
        // we replace them with double quotes.
        const normalized = trimmed.replace(/'/g, '"');
        const parsed = JSON.parse(normalized);
        // Assume the parsed object has URL as key and description as value.
        const items: ToolResearchItem[] = Object.entries(parsed).map(
          ([url, description]) => ({
            url,
            description: description as string,
          })
        );
        return items;
      } catch (e) {
        console.error("Tool research parsing error:", e);
        return null;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");
    setToolResearch([]); // Reset tool research items

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chat-stream?usr_input=${encodeURIComponent(
          input
        )}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      if (!res.body) {
        throw new Error("Response body is null");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the new chunk and add it to the buffer.
        buffer += decoder.decode(value, { stream: true });
        // Split the buffer based on our newline delimiter.
        const lines = buffer.split("\n");

        // The last element may be an incomplete message.
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            // Check if this is a tool research response.
            const toolResult = tryParseToolResearch(data.content);
            if (toolResult) {
              // Update dedicated tool research state.
              setToolResearch((prev) => [...prev, ...toolResult]);
            } else {
              // Otherwise, append to the normal chat stream.
              setResponse((prev) => prev + data.content);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }

      // Process any final pending value from the buffer.
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);
          const toolResult = tryParseToolResearch(data.content);
          if (toolResult) {
            setToolResearch((prev) => [...prev, ...toolResult]);
          } else {
            setResponse((prev) => prev + data.content);
          }
        } catch (error) {
          console.error("Error parsing final JSON:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching stream:", error);
      setResponse("An error occurred while fetching the stream.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 items-center flex flex-col">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Stay Ahead with Cutting-Edge Research
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Get real-time updates on the latest research papers in your
                  field.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2" onSubmit={handleSubmit}>
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter a research topic"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </form>
              </div>
              {/* Display standard chat responses */}
              {response && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg
                  w-full max-w-2xl">
                  <pre className="whitespace-pre-wrap">{response}</pre>
                </div>
              )}
              {/* Display tool research responses in a dedicated box */}
              {toolResearch.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg
                  w-full max-w-2xl">
                  <h2 className="text-xl font-bold mb-2">Research Documents</h2>
                  {toolResearch.map((item, index) => (
                    <div key={index} className="border p-2 rounded mb-2 bg-white
                      dark:bg-gray-700">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline font-medium"
                      >
                        {item.url}
                      </a>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

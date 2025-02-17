"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResearchCard } from "@/components/ResearchCard"; // adjust the import
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

  // Helper to attempt parsing a tool research string into structured data.
  const tryParseToolResearch = (text: string): ToolResearchItem[] | null => {
    const trimmed = text.trim();
    if (
      trimmed.startsWith("{") &&
      trimmed.endsWith("}") &&
      trimmed.includes("http")
    ) {
      try {
        // Replace single quotes with double quotes if necessary.
        const normalized = trimmed.replace(/'/g, '"');
        const parsed = JSON.parse(normalized);
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

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            const toolResult = tryParseToolResearch(data.content);
            if (toolResult) {
              setToolResearch((prev) => [...prev, ...toolResult]);
            } else {
              setResponse((prev) => prev + data.content);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }

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
              {/* Display normal chat responses */}
              {response && (
                <div
                  className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg
                  w-full max-w-2xl"
                >
                  <pre className="whitespace-pre-wrap">{response}</pre>
                </div>
              )}
              {/* Display tool research responses using ResearchCard */}
              {toolResearch.length > 0 && (
                <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {toolResearch.map((item, index) => (
                    <ResearchCard
                      key={index}
                      title={`Research Document`}
                      badges={["Tool Research"]}
                      description={item.description}
                      insights={["Click on Read Full Paper to explore further."]}
                      caution={""}
                    />
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

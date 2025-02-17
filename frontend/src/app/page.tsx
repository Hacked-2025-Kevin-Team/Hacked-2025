"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResearchCard } from "@/components/ResearchCard";

type ToolResearchItem = {
  url: string;
  description: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
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
    if (!input.trim()) return;

    // Add our user prompt as a message.
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setIsLoading(true);
    setInput("");
    // We keep a separate state if needed.
    setToolResearch([]);

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
      let assistantResponse = "";

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
              assistantResponse += data.content;
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
            assistantResponse += data.content;
          }
        } catch (error) {
          console.error("Error parsing final JSON:", error);
        }
      }

      // Once complete, add the assistant's response to the messages.
      if (assistantResponse) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantResponse },
        ]);
      }
    } catch (error) {
      console.error("Error fetching stream:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "An error occurred while fetching the stream.",
        },
      ]);
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Chat with Research Assistant
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Ask follow-up questions or explore related topics in a chat-style
                interface.
              </p>
              <div className="w-full max-w-2xl space-y-4 mt-6">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-4 rounded-lg max-w-full inline-block ${
                          msg.role === "user"
                            ? "bg-blue-100 text-right"
                            : "bg-gray-100 text-left"
                        }`}
                      >
                        <pre className="whitespace-pre-wrap">{msg.content}</pre>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Display tool research responses using ResearchCard */}
                {toolResearch.length > 0 && (
                  <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {toolResearch.map((item, index) => (
                      <ResearchCard
                        key={index}
                        title="Research Document"
                        badges={["AI Tool Research"]}
                        description={item.description}
                        url={item.url}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Chat Input */}
              <div className="w-full max-w-2xl mt-6">
                <form
                  className="flex space-x-2"
                  onSubmit={handleSubmit}
                >
                  <Input
                    className="flex-1"
                    placeholder="Type your message..."
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

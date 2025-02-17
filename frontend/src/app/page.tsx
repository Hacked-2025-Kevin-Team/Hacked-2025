"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ResearchCard } from "@/components/ResearchCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chat-stream?usr_input=${encodeURIComponent(input)}`,
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      if (!res.body) {
        throw new Error("Response body is null");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setResponse((prev) => prev + chunk);
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
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
              {response && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-2xl">
                  <pre className="whitespace-pre-wrap">{response}</pre>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 items-center flex flex-col">
          <div className="container px-4 md:px-6 items-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
              Latest Research Papers
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto">
              <ResearchCard
                title="Quantum Entanglement in Macroscopic Systems"
                badges={["Physics"]}
                description="This groundbreaking paper explores quantum entanglement in macroscopic systems."
                insights={[
                  "Entanglement in large systems",
                  "Applications in quantum computing",
                ]}
              />
              <ResearchCard
                title="AI-Driven Drug Discovery: A New Frontier"
                badges={["Computer Science", "Biology"]}
                description="AI accelerates drug discovery, improving predictions and reducing development time."
                insights={[
                  "50% reduction in drug development",
                  "Revolutionizing personalized medicine",
                ]}
              />
              <ResearchCard
                title="The Impact of Social Media on Adolescent Mental Health"
                badges={["Psychology"]}
                description="Examines the relationship between social media use and mental health in adolescents."
                insights={[
                  "Increased anxiety correlation",
                  "Positive social connection effects",
                ]}
                caution="Exercise caution: Small sample size"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

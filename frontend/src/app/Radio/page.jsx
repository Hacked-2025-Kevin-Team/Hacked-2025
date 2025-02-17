"use client";

import { useEffect, useState } from "react";

export default function RadioPlayer() {
  const [trackInfo, setTrackInfo] = useState({ title: "Loading..." });

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8000/track-updates"
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTrackInfo(data);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Healthcare News Radio
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Stay updated with the latest healthcare research and news
                while you listen.
              </p>
              <div className="mt-8 w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transform transition-all">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
                    Now Playing
                  </h2>
                  <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                      {trackInfo.title}
                    </p>
                  </div>
                  <audio
                    className="w-full"
                    controls
                    autoPlay
                    src="http://localhost:8000/radio"
                  >
                    Your browser does not support the audio element.
                  </audio>
                  <footer className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Stay tuned to get the most recent healthcare updates.
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

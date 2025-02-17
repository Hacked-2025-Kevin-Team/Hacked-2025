'use client';
import { useEffect, useState, useRef } from "react";

export default function RadioPlayer() {
  const [trackInfo, setTrackInfo] = useState({ title: "Loading..." });
  const [audioSrc, setAudioSrc] = useState("http://localhost:8000/radio");
  const audioRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8000/track-updates"
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTrackInfo(data);
      // Update the audio source with a new query string
      const newSrc =
        "http://localhost:8000/radio?t=" + new Date().getTime();
      setAudioSrc(newSrc);
      // Optionally force a reload/play on the audio element:
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="w-full max-w-md p-4 border rounded-lg">
      <h2 className="text-lg font-bold">{trackInfo.title}</h2>
      <audio controls autoPlay src={audioSrc} ref={audioRef}></audio>
    </div>
  );
}

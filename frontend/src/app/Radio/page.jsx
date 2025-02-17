'use client';
import { useEffect, useState } from "react";

export default function RadioPlayer() {
    const [trackInfo, setTrackInfo] = useState({ title: "Loading..." });

    useEffect(() => {
        const eventSource = new EventSource("http://0.0.0.0:8000/track-updates");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTrackInfo(data);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="w-full max-w-md p-4 border rounded-lg">
            <h2 className="text-lg font-bold">{trackInfo.title}</h2>
            <audio controls autoPlay src="http://0.0.0.0:8000/radio"></audio>
        </div>
    );
}

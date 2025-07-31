"use client";
import React from "react";

interface VideoSectionProps {
  title?: string;
  videoUrl: string; // e.g., https://www.youtube.com/embed/dQw4w9WgXcQ
}

const VideoSection: React.FC<VideoSectionProps> = ({ title = "Watch Our Introduction", videoUrl }) => {
  return (
    <section className="w-full h-500px px-4 py-10 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{title}</h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg shadow-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={videoUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

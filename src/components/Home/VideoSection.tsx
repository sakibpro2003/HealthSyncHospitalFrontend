"use client";
import React from "react";

interface VideoSectionProps {
  title?: string;
  videoUrl: string; // Use proper embed link
}

const VideoSection: React.FC<VideoSectionProps> = ({
  title = "Watch Our Introduction",
  videoUrl,
}) => {
  return (
    <section className="w-full px-4 py-10 dark:bg-gray-900">
      <div className="w-11/12 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{title}</h2>
        <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
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

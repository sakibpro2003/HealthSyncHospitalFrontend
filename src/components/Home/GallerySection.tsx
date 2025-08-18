
"use client"; 

import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const images = [
  {
    original: "https://kothiyahospital.com/wp-content/uploads/MANSUKHBHAI-VISIT-1.jpg",
    thumbnail: "https://kothiyahospital.com/wp-content/uploads/MANSUKHBHAI-VISIT-1.jpg",
  },
  {
    original: "https://kothiyahospital.com/wp-content/uploads/MANSUKHBHAI-VISIT2.jpg",
    thumbnail: "https://kothiyahospital.com/wp-content/uploads/MANSUKHBHAI-VISIT2.jpg",
  },
  {
    original: "https://kothiyahospital.com/wp-content/uploads/RAMESH-OZA-Copy.jpg",
    thumbnail: "https://kothiyahospital.com/wp-content/uploads/RAMESH-OZA-Copy.jpg",
  },
];

const MyGallery: React.FC = () => {
  return (
    <div className="w-11/12 mx-auto px-4 py-10">
      <ImageGallery items={images} showPlayButton={false} />
    </div>
  );
};

export default MyGallery;

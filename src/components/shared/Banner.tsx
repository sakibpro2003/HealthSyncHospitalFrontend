"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import b1 from "../../assets/b1.png";
import b2 from "../../assets/b2.png";
import b3 from "../../assets/b3.png";
import b4 from "../../assets/b4.png";
import b5 from "../../assets/b5.png";
import b6 from "../../assets/b6.png";

const slides = [
  {
    id: 1,
    image: b1,
    title: "Welcome to HealthSync",
    description: "Manage your hospital efficiently with our digital tools.",
  },
  {
    id: 2,
    image: b2,
    title: "Patient-Centric Services",
    description: "Improve patient experience with real-time updates and care.",
  },
  {
    id: 3,
    image: b3,
    title: "Secure & Scalable",
    description: "Built with modern technologies and secured by design.",
  },
  {
    id: 4,
    image: b4,
    title: "Secure & Scalable",
    description: "Built with modern technologies and secured by design.",
  },
  {
    id: 5,
    image: b5,
    title: "Secure & Scalable",
    description: "Built with modern technologies and secured by design.",
  },
  {
    id: 6,
    image: b6,
    title: "Secure & Scalable",
    description: "Built with modern technologies and secured by design.",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="w-11/12 mx-auto relative overflow-hidden rounded-2xl shadow-xl">
      <div className="relative h-[350px] w-full">
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          fill
          quality={100}
          sizes="100vw"
          className="object-cover" 
          // 🔄 Change to "object-contain bg-black" if you want NO cropping
          priority
        />
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 
        bg-black bg-opacity-40 p-2 rounded-full text-white hover:bg-opacity-70"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 
        bg-black bg-opacity-40 p-2 rounded-full text-white hover:bg-opacity-70"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Banner;

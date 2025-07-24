"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import b1 from "../../assets/b1.jpg";
import b2 from "../../assets/b2.jpg";
import b3 from "../../assets/b3.jpg";

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
      <div className="relative h-[500px]">
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
        {/* <div className="relative inset-0 bg-opacity-20 bg-blue-300 w-1/3 flex flex-col content-center justify-center items-center text-white text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{slides[current].title}</h2>
          <p className="text-lg md:text-xl">{slides[current].description}</p>
        </div> */}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-40 p-2 rounded-full text-white hover:bg-opacity-70"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-40 p-2 rounded-full text-white hover:bg-opacity-70"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Banner;

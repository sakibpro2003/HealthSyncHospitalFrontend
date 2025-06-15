"use client";
import { useState } from "react";
import Image from "next/image";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1599045118108-bf9954418b76?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Trusted Healthcare Services",
    buttonText: "Make Appointment",
  },
  // {
  //   image:
  //     "https://images.unsplash.com/photo-1588776814546-b1d211d0d4ec",
  //   title: "Expert Doctors & Facilities",
  //   buttonText: "Book a Visit",
  // },
  // {
  //   image:
  //     "https://images.unsplash.com/photo-1606813901371-61ec7b006cd6",
  //   title: "Emergency Care 24/7",
  //   buttonText: "Contact Now",
  // },
];

const HospitalCarousel = () => {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);

  return (
    <div className="relative max-w-4xl mx-auto mt-10 h-96 overflow-hidden rounded-xl shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center px-4">
            <h2 className="text-3xl font-bold">{slide.title}</h2>
            <button className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">
              {slide.buttonText}
            </button>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/40 hover:bg-white/70 text-black px-2 py-1 rounded-full"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/40 hover:bg-white/70 text-black px-2 py-1 rounded-full"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HospitalCarousel;

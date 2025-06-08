"use client";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    image: "https://i.ibb.co/Ghtbh7x/pexels-photo-1379636.jpg",
    title: "Advanced Healthcare, Compassionate Service",
    description: "Experience the future of healthcare at HealthSync Hospital.",
    buttonText: "Make Appointment",
    buttonLink: "/appointment",
  },
  {
    image: "https://i.ibb.co/K2xXb1r/pexels-photo-1250655.jpg",
    title: "24/7 Emergency Support",
    description: "Our dedicated team is always here for you.",
    buttonText: "Contact Now",
    buttonLink: "/contact",
  },
  {
    image: "https://i.ibb.co/V33ZW7F/pexels-photo-305568.jpg",
    title: "Expert Doctors, Trusted Care",
    description: "HealthSync is where technology meets trust.",
    buttonText: "Meet Our Doctors",
    buttonLink: "/doctors",
  },
];

export default function BannerSlider() {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  useEffect(() => {
    if (!slider) return;

    timer.current = setInterval(() => {
      slider.current?.next();
    }, 4000); // Change slide every 4 seconds

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slider]);

  return (
    <div ref={sliderRef} className="keen-slider relative h-[80vh] overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="keen-slider__slide relative h-full w-full"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={idx === 0}
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-start p-10 text-white z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
            <p className="text-lg md:text-xl mb-6 max-w-xl">{slide.description}</p>
            <Link
              href={slide.buttonLink}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold transition"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

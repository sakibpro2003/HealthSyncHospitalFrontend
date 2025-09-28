import Image from "next/image";
import Link from "next/link";
import discountImage from "../../../public/discount.png";

const DiscountSection = () => {
  return (
    <section className="mx-auto mt-10 w-11/12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative w-full md:h-96 rounded-2xl overflow-hidden shadow-lg">
        {/* Background Image */}
        <Image
          src={discountImage}
          alt="Discount Offer"
          fill
          quality={100}
          className="object-cover"
          priority
        />

        {/* Button overlay at the bottom */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Link href="/medicine">
            <button className="px-6 py-3 rounded-full font-medium shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;

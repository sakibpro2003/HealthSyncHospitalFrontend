import Image from "next/image";
import Link from "next/link";

const BookAppointment = () => {
  return (
    <section className="w-11/12 mx-auto shadow-md rounded-md border-1 mt-6 py-16 px-6">
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Text Content */}
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Get Up to <span className="text-red-500">30% Off</span> on Your Medicine Order!
          </h2>
          <p className="text-gray-600 mb-6">
            Save big on essential medicines and healthcare products. Limited-time offer for first-time customers. Fast delivery and quality assurance, just for you!
          </p>
          <Link href="/products">
            <button className="btn-custom p-3 rounded-full font-medium shadow hover:bg-blue-700 transition">
              Shop Now
            </button>
          </Link>
        </div>

        {/* Image */}
        <div className="relative w-full h-64 md:h-80">
          <Image
            src="https://medeasy.health/_next/image?url=https%3A%2F%2Fapi.medeasy.health%2Fmedia%2Fsliders%2Fadp-4.png&w=3840&q=https://i.ibb.co/Ghtbh7x/pexels-photo-1379636.jpg" // replace with your image path
            alt="Discount Offer"
            width={300}
            height={300}
            className="object-cover rounded-xl shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default BookAppointment;
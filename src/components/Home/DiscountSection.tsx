import Link from "next/link";

const DiscountSection = () => {
  return (
    <section className="mx-auto mt-10 w-full px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-500 to-sky-500 shadow-xl">
        <div className="absolute -right-24 top-8 h-56 w-56 rounded-full bg-white/15 blur-3xl" aria-hidden />
        <div className="absolute -left-12 bottom-4 h-40 w-40 rounded-full bg-blue-200/30 blur-2xl" aria-hidden />

        <div className="relative mx-auto flex w-full flex-col items-center justify-center gap-6 px-8 py-16 text-center text-white md:flex-row md:gap-12 md:text-left">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em]">
              Limited Time
            </span>
            <h3 className="text-3xl font-black leading-tight md:text-4xl">
              Save 25% on annual wellness packages
            </h3>
            <p className="text-sm md:text-base text-white/85">
              Lock in comprehensive diagnostics, personalised care coaching, and priority booking for less.
            </p>
          </div>

          <Link href="/medicine" className="relative inline-flex">
            <span className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet-600 shadow-lg transition hover:translate-y-0.5 hover:bg-violet-50">
              Shop Now
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;

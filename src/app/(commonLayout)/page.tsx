import Banner from "@/components/shared/Banner";
import DepartmentButtons from "@/components/shared/DepartmentButtons";
import SectionHeading from "@/components/shared/SectionHeading";
import dynamic from "next/dynamic";
import React from "react";

const SectionPlaceholder = ({ className = "h-64" }: { className?: string }) => (
  <div
    className={`mx-auto mt-16 w-full max-w-6xl animate-pulse rounded-3xl bg-slate-200/60 ${className}`}
    aria-hidden
  />
);

const PackageCard = dynamic(() => import("@/components/Home/PackageCard"), {
  loading: () => <SectionPlaceholder className="h-112" />,
});

const DiscountSection = dynamic(() => import("@/components/Home/DiscountSection"), {
  loading: () => <SectionPlaceholder className="h-48" />,
});

const VideoSection = dynamic(() => import("@/components/Home/VideoSection"), {
  loading: () => <SectionPlaceholder className="h-104" />,
});

const BloodAvailability = dynamic(() => import("@/components/Home/BloodAvailability"), {
  loading: () => <SectionPlaceholder className="h-72" />,
});

const NewsletterSection = dynamic(() => import("@/components/Home/NewsletterSection"), {
  loading: () => <SectionPlaceholder className="h-64" />,
});

const TestimonialsSection = dynamic(() => import("@/components/Home/TestimonialsSection"), {
  loading: () => <SectionPlaceholder className="h-96" />,
});

const AccordioSection = dynamic(() => import("@/components/Home/AccordioSection"), {
  loading: () => <SectionPlaceholder className="h-60" />,
});

const MyGallery = dynamic(() => import("@/components/Home/GallerySection"), {
  loading: () => <SectionPlaceholder className="h-88" />,
});

const NoticeBoard = dynamic(() => import("@/components/Home/NoticeBoard"), {
  loading: () => <SectionPlaceholder className="h-60" />,
});

const page = () => {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Banner />
      {/* TODO: uninstall slider js */}
      {/* <Slider /> */}
      {/* <DepartmentTabs /> */}
      <div className="mx-auto flex w-full max-w-[85vw] flex-1 flex-col pb-20">
        <DepartmentButtons />
        <PackageCard />
        <SectionHeading
          eyebrow="Limited Time"
          title="Save 25% on annual wellness packages"
          description="Lock in comprehensive diagnostics, personalised care coaching, and priority booking for less. Crafted for proactive patients who want hospital-grade care with concierge-level access."
          className="mt-10 mb-6"
        />
        <DiscountSection />
        <SectionHeading
          eyebrow="Intro Video"
          title="See how HealthSync keeps every step connected"
          description="Take a guided tour through our digital hospital - how departments coordinate, clinicians collaborate, and patients stay informed from admission to discharge."
          className="mt-16 mb-8"
        />
        <VideoSection
          title="Intro Video"
          videoUrl="https://www.youtube.com/embed/FHeq7a_2AiE?si=ytMC-rc7mD5a9q1N"
        />
        <SectionHeading
          eyebrow="Blood Bank"
          title="Check availability before you request"
          description="Monitor real-time units across every group so you can plan donations, schedule transfusions, or coordinate alternatives without delays."
          className="mt-16 mb-8"
        />
        <BloodAvailability />
        <TestimonialsSection />
        <NewsletterSection />
        <AccordioSection />
        <MyGallery />
        <NoticeBoard />
      </div>
    </main>
  );
};

export default page;

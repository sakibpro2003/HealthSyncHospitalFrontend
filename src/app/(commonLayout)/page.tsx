import AccordioSection from "@/components/Home/AccordioSection";
import DiscountSection from "@/components/Home/DiscountSection";
import MyGallery from "@/components/Home/GallerySection";
import NewsletterSection from "@/components/Home/NewsletterSection";
import NoticeBoard from "@/components/Home/NoticeBoard";
import PackageCard from "@/components/Home/PackageCard";
import VideoSection from "@/components/Home/VideoSection";
import Banner from "@/components/shared/Banner";
import DepartmentButtons from "@/components/shared/DepartmentButtons";
import BloodAvailability from "@/components/Home/BloodAvailability";
import React from "react";

const page = () => {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Banner />
      {/* TODO: uninstall slider js */}
      {/* <Slider /> */}
      {/* <DepartmentTabs /> */}
      <div className="flex-1 pb-20">
        <DepartmentButtons />
        <PackageCard />
        <DiscountSection />
        <VideoSection
          title="Intro Video"
          videoUrl="https://www.youtube.com/embed/FHeq7a_2AiE?si=ytMC-rc7mD5a9q1N"
        />
        <BloodAvailability />
        <NewsletterSection />
        <AccordioSection />
        <MyGallery />
        <NoticeBoard />
      </div>
    </main>
  );
};

export default page;

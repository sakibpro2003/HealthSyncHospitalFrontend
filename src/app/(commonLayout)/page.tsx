import AccordioSection from "@/components/Home/AccordioSection";
import DiscountSection from "@/components/Home/DiscountSection";
import MyGallery from "@/components/Home/GallerySection";
import NewsletterSection from "@/components/Home/NewsletterSection";
import NoticeBoard from "@/components/Home/NoticeBoard";
import PackageCard from "@/components/Home/PackageCard";
import VideoSection from "@/components/Home/VideoSection";
import Banner from "@/components/shared/Banner";
import DepartmentButtons from "@/components/shared/DepartmentButtons";
import Footer from "@/components/shared/Footer";
import React from "react";

const page = () => {
  return (
    <div className="h-screen">
      <Banner></Banner>
      {/* TODO:              uninstall slider js */}
      {/* <Slider></Slider> */}
      {/* <DepartmentTabs></DepartmentTabs> */}
      <DepartmentButtons></DepartmentButtons>
      <PackageCard></PackageCard>
      <DiscountSection></DiscountSection>
      <VideoSection
        title="Intro Video"
        videoUrl="https://www.youtube.com/embed/FHeq7a_2AiE?si=ytMC-rc7mD5a9q1N"
      ></VideoSection>
      <h1 className="text-center text-2xl font-bold mb-6">Photo Gallery</h1>
      <NewsletterSection></NewsletterSection>
      <AccordioSection></AccordioSection>
      <MyGallery />
      <NoticeBoard />
      <Footer></Footer>
    </div>
  );
};

export default page;

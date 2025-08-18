// import DepartmentTabs from "@/components/DepartmentTabs";
import AccordioSection from "@/components/Home/AccordioSection";
import BookAppointment from "@/components/Home/DiscountSection";
import MyGallery from "@/components/Home/GallerySection";
import PackageCard from "@/components/Home/PackageCard";
import VideoSection from "@/components/Home/VideoSection";
// import NewsletterSection from "@/components/Home/NewsletterSection";
import Banner from "@/components/shared/Banner";
import DepartmentButtons from "@/components/shared/DepartmentButtons";
import Footer from "@/components/shared/Footer";
// import Slider from "@/components/shared/Slider";
// import { Button } from "@/components/ui/button";
// import { Carousel } from "@/components/ui/carousel";
import React from "react";

const page = () => {
  return (
    <div className="h-screen">
      <Banner></Banner>
      {/* TODO:              uninstall slider js */}
      {/* <Slider></Slider> */}
      {/* <DepartmentTabs></DepartmentTabs>          uninstall it */}
      <BookAppointment></BookAppointment>
      <DepartmentButtons></DepartmentButtons>
      <PackageCard></PackageCard>
      <VideoSection title="Intro Video" videoUrl="https://www.youtube.com/embed/FHeq7a_2AiE?si=ytMC-rc7mD5a9q1N"></VideoSection>
      {/* <NewsletterSection></NewsletterSection> */}
       {/* <h1 className="text-center text-2xl font-bold mb-6">Photo Gallery</h1> */}
      {/* <div className="flex w-11/12 mx-auto gap-4"> */}
        <AccordioSection></AccordioSection>
      <MyGallery />
      {/* </div> */}
      <Footer></Footer>
      <p className="text-6xl text-yellow-400"> gallery images</p>
      <p className="text-6xl text-yellow-400"> add animations</p>
      <p className="text-6xl text-yellow-400"> notice board</p>
      <p className="text-6xl text-yellow-400"> department wise capcity /admit</p>
    </div>
  );
};

export default page;

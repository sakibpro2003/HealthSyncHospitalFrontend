// import DepartmentTabs from "@/components/DepartmentTabs";
import AccordioSection from "@/components/Home/AccordioSection";
import BookAppointment from "@/components/Home/DiscountSection";
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
      {/* <NewsletterSection></NewsletterSection> */}
      <AccordioSection></AccordioSection>
      <Footer></Footer>
      <p className="text-6xl"> gallery images</p>
      <p className="text-6xl"> add animations</p>
      <p className="text-6xl"> add video section</p>
      <p className="text-6xl"> add health package section</p>
    </div>
  );
};

export default page;

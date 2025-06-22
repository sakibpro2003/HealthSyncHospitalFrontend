// import DepartmentTabs from "@/components/DepartmentTabs";
import BookAppointment from "@/components/Home/BookAppointment";
// import NewsletterSection from "@/components/Home/NewsletterSection";
import Banner from "@/components/shared/Banner";
import DepartmentButtons from "@/components/shared/DepartmentButtons";
import Footer from "@/components/shared/Footer";
// import { Button } from "@/components/ui/button";
// import { Carousel } from "@/components/ui/carousel";
import React from "react";

const page = () => {
  return <div className="h-screen">
    <Banner></Banner>
    {/* <DepartmentTabs></DepartmentTabs>          uninstall it */}
    <BookAppointment></BookAppointment>
    <DepartmentButtons></DepartmentButtons>
    {/* <NewsletterSection></NewsletterSection> */}
    <Footer></Footer>
  </div>;
};

export default page;

import DepartmentTabs from "@/components/DepartmentTabs";
import BookAppointment from "@/components/Home/BookAppointment";
import NewsletterSection from "@/components/Home/NewsletterSection";
import Banner from "@/components/shared/Banner";
import { Button } from "@/components/ui/button";
// import { Carousel } from "@/components/ui/carousel";
import React from "react";

const page = () => {
  return <div className="h-screen">
    <Banner></Banner>
    <DepartmentTabs></DepartmentTabs>
    <BookAppointment></BookAppointment>
    <NewsletterSection></NewsletterSection>
  </div>;
};

export default page;

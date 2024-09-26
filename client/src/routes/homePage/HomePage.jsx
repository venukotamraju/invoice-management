import React from "react";
import MuiNavBar from "./MuiNavBar";
import MuiFooter from "./MuiFooter";
import { Outlet } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <MuiNavBar />
      <Outlet />
      <MuiFooter />
      {/* 
      <AboutUs />
      <Testimonial />
      <ContactUs /> */}
    </div>
  );
}

export default HomePage;

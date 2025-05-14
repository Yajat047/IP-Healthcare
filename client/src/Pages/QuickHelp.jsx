import React from "react";
import { Navbar } from "../Components/Navbar.jsx";
import QuickHelpCard from "../Components/QuickHelpCard.jsx";
import FAQs from "../Components/FAQs.jsx";
import { Footer } from "../Components/Footer.jsx";

const QuickHelp = () => {
  return (
    <div className="sec-1 w-full h-fit bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      <div className="w-full p-10 flex justify-center">
        <QuickHelpCard data={"Diabetes Prediction"} link={"/diabetes-predictor"}/>
        <QuickHelpCard data={"Heart Disease Prediction"} link={"/heart-disease-predictor"}/>
        <QuickHelpCard data={"Hypothyroidism Prediction"} link={"/thyroid-predictor"}/>
        <QuickHelpCard data={"Coming Soon"} />
      </div>
      <FAQs />
      <Footer />
    </div>
  );
};

export default QuickHelp;

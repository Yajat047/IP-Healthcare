import React from "react";
import { Link } from "react-router-dom";

const QuickHelpCard = ({ data, link }) => {
  const service = data;

  return (
    <Link to={link}>
      <div className="relative flex bg-white box-border h-60 w-52 rounded-3xl p-4 border-4 border-gray-300 shadow-lg place-content-center items-center mx-14 my-10 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-teal-500 hover:bg-teal-50">
        <p className="text-black font-semibold text-2xl mt-2 text-center">
          {service}
        </p>
      </div>
    </Link>
  );
};

export default QuickHelpCard;

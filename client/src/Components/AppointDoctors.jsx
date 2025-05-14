import React from "react";
import { useNavigate } from "react-router-dom";

const AppointDoctors = ({ data, onClick }) => {
  const navigateTo = useNavigate();
  function checkToken() {
    const token = localStorage.getItem("authToken");
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  const tokenExists = checkToken();
  return (
    <div
      key={data._id}
      className="flex  bg-white box-border h-fit w-52 rounded-3xl p-4 border-4 shadow-[0_24px_40px_-15px_rgba(0,0,0,0.3)] flex-col items-center mx-14 mb-10"
    >
      <div className="w-28 h-28 rounded-full border-2 border-emerald-300 mb-2">
        <img className="w-28 h-28 rounded-full" src={data.avatar && data.avatar.url} alt="" />
      </div>
      <h1 className="text-black font-semibold text-xl ">
        {data.firstName}
      </h1>
      <h1 className="text-black font-semibold text-xl ">
        {data.lastName}
      </h1>
      <h1 className="text-black font-semibold text-xl">
        {data.doctorDepartment}
      </h1>
      <button
        onClick={() => {
          if (tokenExists) {
            // console.log(element.firstName);
            onClick(data);
          } else {
            navigateTo("/login");
          }
        }}
        // onClick={() => {
        //   setShowModal(true);
        // }}
        className="w-40 bg-[#76dbcf] rounded-2xl h-10 font-semibold mt-2"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default AppointDoctors;

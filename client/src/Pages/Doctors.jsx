import React from "react";
import Sidebar from "../Components/Sidebar";
import { useState, useContext, useEffect } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link, Navigate } from "react-router-dom";
import RemoveDoctors from "../Components/RemoveDoctors";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          // "https://e-healthcare-management-system-2.onrender.com/api/v1/users/doctors",
          "http://localhost:8000/api/v1/users/doctors",
          {
            withCredentials: true
          }
        );
        console.log(data.doctors);
        setDoctors(data.doctors);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);
  const navigateTo = useNavigate();
  const goToLogin = () => {
    navigateTo("/login");
  };
  return (
    <div className="flex">
      <Sidebar />
      <section className="page messages p-7 w-full">
        <div className="w-full flex justify-center">
          <h1 className="font-semibold text-3xl mb-3">Our Doctors</h1>
        </div>
        <div className="doc-details p-5 flex justify-around flex-wrap">
      {doctors && doctors.length > 0 ? (
        doctors.map((element) => (
          <RemoveDoctors key={element._id} data={element} />
        ))):(
          <h1>No Doctors</h1>
        )}
      </div>
        {/* <div className="doc-details p-5 flex justify-around flex-wrap">
          {doctors && doctors.length > 0 ? (
            doctors.map((element) => {
              return (
                <div className="flex  bg-white box-border h-fit w-52 rounded-3xl p-4 border-4 shadow-[0_24px_40px_-15px_rgba(0,0,0,0.3)] flex-col items-center mx-14 mb-10">
                  <div className="w-28 h-28 rounded-full border-2 border-emerald-300 mb-2">
                    <img
                      src={element.avatar && element.avatar.url}
                      alt="doctor"
                    />
                  </div>
                  <h1 className="text-black font-semibold text-xl ">
                    {element.firstName}
                  </h1>
                  <h1 className="text-black font-semibold text-xl ">
                    {element.lastName}
                  </h1>
                  <h1 className="text-black font-semibold text-xl">
                    {element.doctorDepartment}
                  </h1>
                </div>
              );
            })
          ) : (
            <h1>No Doctors</h1>
          )}
        </div> */}
      </section>
    </div>
  );
};

export default Doctors;

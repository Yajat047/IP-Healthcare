import React from "react";
import Sidebar from "../Components/Sidebar";
import { useContext, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const AdminHome = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);
  // const {admindata}=null
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/users/doctors",
          // "https://e-healthcare-management-system-2.onrender.com/users/doctors",
          {
            withCredentials: true,
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

  console.log(doctors.length);

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/appoinments/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/admin/",
          {
            withCredentials: true,
          }
        );
        response.data.data[response.data.data.length - 1];
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {}
    };
    fetchUser();
  }, [isAuthenticated]);
  // const { isAuthenticated, admin } = useContext(Context);
  console.log(isAuthenticated);
  // const admindata=response.data.data[response.data.data.length-1]
  // console.log(admindata)

  const { firstName, lastName } = JSON.parse(localStorage.getItem("admin"));

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full pt-8 pr-8 pl-6">
        <div className="w-full bg-sky-100 h-fit rounded-2xl p-5 flex flex-col items-center mb-5">
          <h1 className="text-4xl font-semibold mb-8">
            Hi, {firstName + " " + lastName}
          </h1>
          <div className="flex w-full gap-10 mb-4">
            <div className="w-1/2 bg-[#76dbcf] rounded-xl p-8 font-semibold text-2xl flex justify-between">
              <h1>Total No. Of Doctors :</h1>
              <h1>{doctors.length}</h1>
            </div>
            <div className="w-1/2 bg-[#76dbcf] rounded-xl p-8 font-semibold text-2xl flex justify-between">
              <h1>Total No. Of Appointments :</h1>
              <h1>{appointments.length}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

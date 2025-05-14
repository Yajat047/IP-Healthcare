import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { Navbar } from "../Components/Navbar";
import { TicketX } from "lucide-react";
import { TicketCheck } from "lucide-react";

const PatientHome = () => {
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
  console.log(appointments);
  console.log(appointments.length);
  console.log(typeof appointments);

  const { firstName, lastName } = JSON.parse(localStorage.getItem("patient"));
  console.log(firstName);
  const pat = JSON.parse(localStorage.getItem("patient"));
  const k = Object.keys(appointments);
  const b = k;
  // console.log([appointments[0]].firstName);
  console.log(k);
  var c=0;
  appointments.forEach((obj)=>{
    if (obj.patientId === pat._id){
      c++
    }
  })

  return (
    <div className="w-full h-screen bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      <div className="h-28 flex justify-around mt-10 px-60">
        <div className="w-1/3 font-semibold text-3xl flex gap-5 items-center">
          <div className="h-full flex flex-col justify-center">
            <h1>Hi, {firstName + " " + lastName}</h1>
          </div>
        </div>
        <div className="w-1/3 flex h-full bg-[#76dbcf] px-4 font-semibold text-2xl rounded-3xl items-center justify-center">
          Appointments Scheduled : {c}
        </div>
      </div>
      <div className="px-28 mt-10">
        <h1 className=" ml-10 font-semibold text-2xl">
          Appointment Details :{" "}
        </h1>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Appointment Date</th>
              <th>Appointment Status</th>
              <th>Doctor Name</th>
              <th>Doctor Department</th>
            </tr>
          </thead>
          <tbody className="">
            {k && k.length > 0 ? (
              k.map((k) => (
                <tr className="">
                  {appointments[k].patientId === pat._id ? (
                    <>
                      <td className="name text-center rounded-l-2xl">
                        {appointments[k].firstName} {appointments[k].lastName}
                      </td>
                      <td className="date text-center">
                        {appointments[k].appointment_date.substring(0, 10)}
                      </td>
                      <td className="status text-center">
                        {appointments[k].status}
                      </td>
                      <td className="doctor text-center">
                        {appointments[k].doctor.firstName}{" "}
                        {appointments[k].doctor.lastName}
                      </td>
                      <td className="doctor-dept text-center">
                      {appointments[k].department}
                      </td>
                    </>
                  ) : (
                    <h1></h1>
                  )}
                </tr>
              ))
            ) : (
              <h1>No Appointment Scheduled</h1>
            )}

            {/* {appointments && appointments.length > 0 ? (
              Object.keys(appointments).map((key) => (
                <h1>
                  {key}
                </h1>
              ))
            ) : (
              <h1>one</h1>
            )} */}
            {/* .map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date.substring(0, 10)}</td>
                  </tr>
                ))
            ) : (
              <h1>no app</h1>
            )} */}
            {/* {appointments && appointments.length > 0
              ? appointments.filter()
              : hi} */}
            {/* <tr className="">
              <td className="text-center">HI</td>
              <td className="text-center">HI</td>
              <td className="text-center">HI</td>
              <td className="text-center">HI</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHome;

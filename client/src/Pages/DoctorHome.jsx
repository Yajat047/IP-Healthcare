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

const DoctorHome = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [doctorData, setDoctorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const doctor = localStorage.getItem("doctor");
    if (doctor) {
      setDoctorData(JSON.parse(doctor));
    }
    setIsLoading(false);
  }, []);

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
        toast.error("Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8000/api/v1/appoinments/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check for doctor data in localStorage
  const doctor = localStorage.getItem("doctor");
  if (!doctor) {
    return <Navigate to="/login" />;
  }

  // Parse doctor data
  const parsedDoctor = JSON.parse(doctor);
  if (parsedDoctor.role !== "Doctor") {
    return <Navigate to="/login" />;
  }

  const appointmentCount = appointments.filter(
    (obj) => obj.doctorId === parsedDoctor._id
  ).length;

  return (
    <div className="w-full h-screen bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      <div className="h-28 flex justify-around mt-10">
        <div className="w-1/3 font-semibold text-3xl flex gap-5 items-center">
          <img
            className="w-28 h-28 rounded-full border-2 border-emerald-300"
            src={parsedDoctor?.avatar?.url || "/default-avatar.png"}
            alt="Doctor Avatar"
          />
          <div className="h-full flex flex-col justify-center">
            <h1>Hi, Dr. {parsedDoctor.firstName + " " + parsedDoctor.lastName}</h1>
            <h1>{parsedDoctor.doctorDepartment}</h1>
          </div>
        </div>
        <div className="w-1/3 flex h-full bg-[#76dbcf] p-4 font-semibold text-2xl rounded-3xl items-center justify-center">
          Appointments Scheduled: {appointmentCount}
        </div>
      </div>
      <div className="px-28 mt-10">
        <h1 className="ml-10 font-semibold text-2xl">Appointment Details:</h1>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Status</th>
              <th>Visited</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                appointment.doctor.firstName === parsedDoctor.firstName &&
                appointment.doctor.lastName === parsedDoctor.lastName && (
                  <tr key={appointment._id}>
                    <td className="name text-center rounded-l-2xl">
                      {appointment.firstName} {appointment.lastName}
                    </td>
                    <td className="date text-center">
                      {new Date(appointment.appointment_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="status text-center">
                      <select
                        className={`value-${appointment.status.toLowerCase()}`}
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>
                        <option value="Accepted" className="value-accepted">
                          Accepted
                        </option>
                        <option value="Rejected" className="value-rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td className="visited flex justify-center">
                      {appointment.hasVisited ? (
                        <TicketCheck fill="#00ff1a" className="green" />
                      ) : (
                        <TicketX fill="red" className="red" />
                      )}
                    </td>
                  </tr>
                )
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorHome;

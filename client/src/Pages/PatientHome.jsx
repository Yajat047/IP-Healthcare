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
import { FileText } from "lucide-react";
import PrescriptionView from "../Components/PrescriptionView";

const PatientHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescription, setShowPrescription] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/appoinments/my",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const { firstName, lastName } = JSON.parse(localStorage.getItem("patient"));
  const pat = JSON.parse(localStorage.getItem("patient"));
  const k = Object.keys(appointments);
  var c = 0;
  appointments.forEach((obj) => {
    if (obj.patientId === pat._id) {
      c++;
    }
  });

  const handleViewPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescription(true);
  };

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
        <h1 className="ml-10 font-semibold text-2xl">Appointment Details :</h1>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Appointment Status</th>
              <th>Doctor Name</th>
              <th>Doctor Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {k && k.length > 0 ? (
              k.map((k) => (
                appointments[k].patientId === pat._id && (
                  <tr key={k}>
                    <td className="name text-center rounded-l-2xl">
                      {appointments[k].firstName} {appointments[k].lastName}
                    </td>
                    <td className="date text-center">
                      {appointments[k].appointment_date
                        ? new Date(appointments[k].appointment_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : ''}
                    </td>
                    <td className="time text-center">
                      {appointments[k].appointment_time || ''}
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
                    <td className="text-center">
                      <button
                        onClick={() => handleViewPrescription(appointments[k])}
                        className="bg-[#76dbcf] text-black px-4 py-2 rounded hover:bg-[#5bc4b7] flex items-center gap-2 mx-auto"
                      >
                        <FileText size={20} />
                        View Prescription
                      </button>
                    </td>
                  </tr>
                )
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Appointments Scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Prescription Modal */}
        {showPrescription && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Prescription Details</h2>
                <button
                  onClick={() => setShowPrescription(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <PrescriptionView appointmentId={selectedAppointment._id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHome;

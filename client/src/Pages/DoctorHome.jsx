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
import { FileText, Pencil, Trash2 } from "lucide-react";
import PrescriptionView from "../Components/PrescriptionView";
import DoctorScheduleEditor from '../Components/DoctorScheduleEditor';

const DoctorHome = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [doctorData, setDoctorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [hasPrescription, setHasPrescription] = useState({});
  const [prescriptionData, setPrescriptionData] = useState({
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: '',
    diagnosis: ''
  });

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      setDoctorData(JSON.parse(storedDoctor));
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
        
        // Check for existing prescriptions
        const prescriptionStatus = {};
        for (const appointment of data.appointments) {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/v1/prescriptions/appointment/${appointment._id}`,
              { withCredentials: true }
            );
            prescriptionStatus[appointment._id] = true;
          } catch (error) {
            prescriptionStatus[appointment._id] = false;
          }
        }
        setHasPrescription(prescriptionStatus);
      } catch (error) {
        setAppointments([]);
        toast.error("Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const storedDoctor = JSON.parse(localStorage.getItem('doctor'));
        const response = await axios.get(
          `http://localhost:8000/api/v1/users/doctors/${storedDoctor._id}`,
          { withCredentials: true }
        );
        setDoctorData(response.data.doctor);
      } catch (error) {
        console.error("Failed to fetch doctor details:", error);
      }
    };

    fetchDoctorDetails();
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

  const handleAddMedication = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '' }]
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...prescriptionData.medications];
    updatedMedications[index][field] = value;
    setPrescriptionData(prev => ({
      ...prev,
      medications: updatedMedications
    }));
  };

  const handleRemoveMedication = (index) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleEditPrescription = async (appointment) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/prescriptions/appointment/${appointment._id}`,
        { withCredentials: true }
      );
      setPrescriptionData({
        medications: data.medications,
        instructions: data.instructions,
        diagnosis: data.diagnosis
      });
      setSelectedAppointment(appointment);
      setIsEditing(true);
      setShowPrescriptionModal(true);
    } catch (error) {
      toast.error("Failed to fetch prescription");
    }
  };

  const handleDeletePrescription = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/prescriptions/appointment/${selectedAppointment._id}`,
        { withCredentials: true }
      );
      setHasPrescription(prev => ({
        ...prev,
        [selectedAppointment._id]: false
      }));
      setShowPrescriptionModal(false);
      toast.success("Prescription deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete prescription");
    }
  };

  const handleViewPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleSubmitPrescription = async () => {
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8000/api/v1/prescriptions/appointment/${selectedAppointment._id}`,
          {
            appointmentId: selectedAppointment._id,
            ...prescriptionData
          },
          { withCredentials: true }
        );
        toast.success("Prescription updated successfully");
      } else {
        await axios.post(
          "http://localhost:8000/api/v1/prescriptions",
          {
            appointmentId: selectedAppointment._id,
            ...prescriptionData
          },
          { withCredentials: true }
        );
        setHasPrescription(prev => ({
          ...prev,
          [selectedAppointment._id]: true
        }));
        toast.success("Prescription added successfully");
      }
      setShowPrescriptionModal(false);
      setPrescriptionData({
        medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
        instructions: '',
        diagnosis: ''
      });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save prescription");
    }
  };

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check for doctor data
  if (!doctorData) {
    return <Navigate to="/login" />;
  }

  if (doctorData.role !== "Doctor") {
    return <Navigate to="/login" />;
  }

  const appointmentCount = appointments.filter(
    (obj) => obj.doctorId === doctorData._id
  ).length;

  return (
    <div className="w-full h-screen bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      <div className="h-28 flex justify-around mt-10">
        <div className="w-1/3 font-semibold text-3xl flex gap-5 items-center">
          <img
            className="w-28 h-28 rounded-full border-2 border-emerald-300 object-cover"
            src={doctorData?.avatar?.url || "/default-avatar.png"}
            alt={`Dr. ${doctorData.firstName} ${doctorData.lastName}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
          <div className="h-full flex flex-col justify-center">
            <h1>Hi, Dr. {doctorData.firstName + " " + doctorData.lastName}</h1>
            <h1>{doctorData.doctorDepartment}</h1>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                appointment.doctor.firstName === doctorData.firstName &&
                appointment.doctor.lastName === doctorData.lastName && (
                  <tr key={appointment._id}>
                    <td className="name text-center rounded-l-2xl">
                      {appointment.firstName} {appointment.lastName}
                    </td>
                    <td className="date text-center">
                      {new Date(appointment.appointment_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }).replace(/\//g, ' ')}
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
                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        {!hasPrescription[appointment._id] ? (
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowPrescriptionModal(true);
                              setIsEditing(false);
                            }}
                            className="bg-[#76dbcf] text-black px-4 py-2 rounded hover:bg-[#5bc4b7] flex items-center gap-2"
                          >
                            <FileText size={20} />
                            Add Prescription
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleViewPrescription(appointment)}
                              className="bg-[#76dbcf] text-black px-4 py-2 rounded hover:bg-[#5bc4b7] flex items-center gap-2"
                            >
                              <FileText size={20} />
                              View
                            </button>
                            <button
                              onClick={() => handleEditPrescription(appointment)}
                              className="bg-[#76dbcf] text-black px-4 py-2 rounded hover:bg-[#5bc4b7] flex items-center gap-2"
                            >
                              <Pencil size={20} />
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Edit Prescription' : 'Add Prescription'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Diagnosis</label>
                <textarea
                  value={prescriptionData.diagnosis}
                  onChange={(e) => setPrescriptionData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">Medications</label>
                {prescriptionData.medications.map((med, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">Medication {index + 1}</h3>
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveMedication(index)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm">Name</label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm">Dosage</label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm">Frequency</label>
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm">Duration</label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddMedication}
                  className="mt-2 text-blue-500"
                >
                  + Add Another Medication
                </button>
              </div>

              <div>
                <label className="block font-semibold mb-2">Instructions</label>
                <textarea
                  value={prescriptionData.instructions}
                  onChange={(e) => setPrescriptionData(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                {isEditing && (
                  <button
                    onClick={handleDeletePrescription}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                  >
                    <Trash2 size={20} />
                    Delete Prescription
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowPrescriptionModal(false);
                    setIsEditing(false);
                    setPrescriptionData({
                      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
                      instructions: '',
                      diagnosis: ''
                    });
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPrescription}
                  className="px-4 py-2 bg-[#76dbcf] text-black rounded hover:bg-[#5bc4b7]"
                >
                  {isEditing ? 'Update Prescription' : 'Save Prescription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Prescription Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <PrescriptionView appointmentId={selectedAppointment._id} />
          </div>
        </div>
      )}

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Schedule</h2>
            <DoctorScheduleEditor doctor={doctorData} onUpdate={setDoctorData} />
          </div>
          {/* Add other dashboard components here */}
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;

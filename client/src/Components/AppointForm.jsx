import React, { useState, useEffect, memo } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import TimeSlotSelector from './TimeSlotSelector';

const AppointForm = memo(({ data, onClose }) => {
  if (!data) return null;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    appointmentDate: "",
    address: "",
    hasVisited: false,
    selectedTime: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate min and max dates for appointment
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months in advance
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const fetchDoctorDetails = async () => {
    if (!data?.firstName || !data?.lastName) {
      setError("Invalid doctor information");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/users/doctors/${encodeURIComponent(data.firstName)}/${encodeURIComponent(data.lastName)}`,
        { withCredentials: true }
      );
      if (response.data?.doctor) {
        setSelectedDoctor(response.data.doctor);
      } else {
        setError("Doctor details not found");
        toast.error("Doctor details not found");
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch doctor details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAppointment = async (e) => {
    e.preventDefault();

    if (!formData.selectedTime) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/appoinments/post",
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.selectedTime,
          department: data.doctorDepartment,
          doctor_firstName: data.firstName,
          doctor_lastName: data.lastName,
          hasVisited: formData.hasVisited,
          address: formData.address.trim(),
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      toast.success(response.data.message);
      onClose();
      
      // Clear form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        appointmentDate: "",
        address: "",
        hasVisited: false,
        selectedTime: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [data.firstName, data.lastName]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <IoMdCloseCircleOutline size={24} />
            </button>
          </div>
          <p className="text-center text-gray-700">{error}</p>
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoMdCloseCircleOutline size={24} />
          </button>
        </div>
        <form onSubmit={handleAppointment} className="space-y-4">
          <div className="w-full flex justify-around mb-6">
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full flex justify-around mb-6">
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
              type="tel"
              name="phone"
              placeholder="Phone No *"
              value={formData.phone}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
            />
          </div>
          <div className="w-full flex justify-around mb-6">
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
              type="date"
              name="dob"
              placeholder="Date of Birth *"
              value={formData.dob}
              onChange={handleInputChange}
              required
              max={today}
            />
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
              type="date"
              name="appointmentDate"
              placeholder="Appointment Date *"
              value={formData.appointmentDate}
              onChange={handleInputChange}
              required
              min={today}
              max={maxDateStr}
            />
          </div>
          <div className="w-full flex justify-around mb-6">
            <label className="w-96 h-10 bg-zinc-200 rounded-2xl px-4">
              <select
                className="w-full h-10 bg-zinc-200 rounded-2xl border-0 outline-none"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender *</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <textarea
              className="w-96 bg-zinc-200 rounded-2xl px-4 py-2 outline-none"
              rows="1"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address *"
              required
            />
          </div>
          <div className="w-full px-14 flex gap-10 flex-start mb-6">
            <p>Have you visited before?</p>
            <input
              type="checkbox"
              name="hasVisited"
              checked={formData.hasVisited}
              onChange={handleInputChange}
            />
          </div>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading time slots...</p>
            </div>
          ) : selectedDoctor && formData.appointmentDate ? (
            <TimeSlotSelector
              doctor={selectedDoctor}
              selectedDate={formData.appointmentDate}
              onTimeSelect={(time) => setFormData(prev => ({ ...prev, selectedTime: time }))}
            />
          ) : null}
          <div className="flex w-full justify-center">
            <button
              className="w-96 bg-[#76dbcf] rounded-2xl h-10 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading || !selectedDoctor}
            >
              {isLoading ? "Loading..." : "Confirm Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AppointForm.displayName = 'AppointForm';

export default AppointForm;

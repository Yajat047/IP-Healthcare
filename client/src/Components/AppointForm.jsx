import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AppointForm = ({ data, onClose}) => {
  if(!data)return null;
  console.log(data)

  const docfirst = data.firstName
  const doclast = data.lastName
  const dept = data.doctorDepartment
  console.log(docfirst,doclast,dept);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  // Calculate min and max dates for appointment
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months in advance
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleAppointment = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !dob || !gender || !appointmentDate || !address) {
      toast.error("Please fill all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // Date validations
    const dobDate = new Date(dob);
    const appointmentDateTime = new Date(appointmentDate);
    const currentDate = new Date();

    if (dobDate >= currentDate) {
      toast.error("Date of birth must be in the past");
      return;
    }

    if (appointmentDateTime <= currentDate) {
      toast.error("Appointment date must be in the future");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/appoinments/post",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone,
          dob,
          gender,
          appointment_date: appointmentDate,
          department: dept,
          doctor_firstName: docfirst,
          doctor_lastName: doclast,
          hasVisited,
          address: address.trim(),
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      toast.success(response.data.message);
      onClose();
      
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setAddress("");
      setHasVisited(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="w-2/3 flex flex-col">
        <button onClick={onClose} className="place-self-end mb-3">
          <IoMdCloseCircleOutline size={30} />
        </button>
        <div className="w-full flex flex-col items-center bg-white rounded-2xl p-6">
          <h1 className="font-semibold text-2xl mb-3">
            Schedule Your Appointment
          </h1>
          <form
            className="w-full flex flex-col justify-center items-center"
            onSubmit={handleAppointment}
          >
            <div className="w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                placeholder="First Name *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                minLength={3}
              />
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                placeholder="Last Name *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                minLength={3}
              />
            </div>
            <div className="w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="tel"
                placeholder="Phone No *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
              />
            </div>
            <div className="w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="date"
                placeholder="Date of Birth *"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                max={today}
              />
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="date"
                placeholder="Appointment Date *"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                min={today}
                max={maxDateStr}
              />
            </div>
            <div className="w-full flex justify-around mb-6">
              <label className="w-96 h-10 bg-zinc-200 rounded-2xl px-4">
                <select
                  className="w-full h-10 bg-zinc-200 rounded-2xl border-0 outline-none"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address *"
                required
              />
            </div>
            <div className="w-full px-14 flex gap-10 flex-start mb-6">
              <p>Have you visited before?</p>
              <input
                type="checkbox"
                checked={hasVisited}
                onChange={(e) => setHasVisited(e.target.checked)}
              />
            </div>
            <div className="flex w-full justify-center">
              <button
                className="w-96 bg-[#76dbcf] rounded-2xl h-10 font-semibold"
                type="submit"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointForm;

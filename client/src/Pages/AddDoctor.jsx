import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import Sidebar from "../Components/Sidebar";

const AddDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");

  const navigateTo = useNavigate();

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!firstName || !lastName || !email || !phone || !dob || !gender || !password || !doctorDepartment || !docAvatar) {
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

    // Aadhar validation (if provided)
    if (nic && !/^\d{12}$/.test(nic)) {
      toast.error("Aadhar number must be exactly 12 digits");
      return;
    }

    // Date validation
    const selectedDate = new Date(dob);
    if (selectedDate >= new Date()) {
      toast.error("Date of birth must be in the past");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    formData.append("email", email.trim().toLowerCase());
    formData.append("phone", phone);
    if (nic) formData.append("nic", nic);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("password", password);
    formData.append("doctorDepartment", doctorDepartment);
    formData.append("avatar", docAvatar);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/users/doctor/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      navigateTo("/admin/doctors");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login/admin" />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full flex items-center">
        <div className="w-full pl-7 pt-7 pr-7">
          <div className="add-admin-form bg-sky-200 w-full h-fit rounded-2xl px-5 py-3 flex flex-col items-center">
            <h1 className="font-semibold text-3xl mt-3 mb-5">Add New Doctor</h1>
            <div className="w-full h-fit mb-10">
              <form onSubmit={handleAddNewDoctor}>
                <div className="flex justify-around mb-6 items-center">
                  <input
                    className="h-10 bg-zinc-200 rounded-2xl px-4 items-center"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatar}
                    required
                  />
                  {docAvatarPreview && (
                    <img
                      src={docAvatarPreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  )}
                </div>
                <div className="flex justify-around mb-6">
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="text"
                    placeholder="First Name *"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="text"
                    placeholder="Last Name *"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-around mb-6">
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="tel"
                    placeholder="Mobile Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                <div className="w-full flex justify-around mb-6">
                  <input
                    className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                    type="text"
                    placeholder="Aadhar No. (Optional)"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    pattern="[0-9]{12}"
                  />
                  <input
                    className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                    type="date"
                    placeholder="Date Of Birth *"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="flex justify-around mb-6">
                  <label className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4">
                    <select
                      className="w-full h-10 bg-zinc-200 rounded-2xl border-0"
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
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="password"
                    placeholder="Password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div className="w-full flex justify-center">
                  <label className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4">
                    <select
                      className="w-full h-10 bg-zinc-200 rounded-2xl border-0"
                      value={doctorDepartment}
                      onChange={(e) => setDoctorDepartment(e.target.value)}
                      required
                    >
                      <option value="">Select Department *</option>
                      {departmentsArray.map((depart, index) => (
                        <option value={depart} key={index}>
                          {depart}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="flex w-full justify-center mt-6">
                  <button
                    className="w-96 bg-[#76dbcf] rounded-2xl h-10 font-semibold"
                    type="submit"
                  >
                    ADD NEW DOCTOR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;

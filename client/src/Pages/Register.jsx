import React, { useContext, useState } from "react";
import { IoRemoveOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

//import { Navbar } from "../Components/Navbar";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();
  const goToLogin = () => {
    navigateTo("/login");
  };
  const goToHome = () => {
    navigateTo("/");
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
      toast.error("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      setIsLoading(false);
      return;
    }

    // Aadhar validation (if provided)
    if (nic && !/^\d{12}$/.test(nic)) {
      toast.error("Aadhar number must be exactly 12 digits");
      setIsLoading(false);
      return;
    }

    // Date validation
    const selectedDate = new Date(dob);
    if (selectedDate >= new Date()) {
      toast.error("Date of birth must be in the past");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/users/patient/register",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone,
          ...(nic && { nic }), // Only include nic if it's provided
          dob,
          gender,
          password,
          role: "Patient",
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Show success toast with custom styling
      toast.success("Registration Successful! Redirecting to login...", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#4CAF50",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
        },
      });

      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setPassword("");

      // Redirect after a short delay
      setTimeout(() => {
        navigateTo("/login");
      }, 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="flex">
        <div className="w-1/3 h-screen bg-[#76dbcf] flex flex-col place-content-center items-center rounded-r-full">
          <h2 className="text-4xl flex w-full justify-center font-bold">
            Hello, Welcome!!
          </h2>
          <IoRemoveOutline size={80} />
          <p className="text-2xl flex w-full justify-center mb-6">
            Already Have An Account !!!
          </p>
          <button
            className="w-40 rounded-2xl h-10 font-semibold border-solid border-2 border-black"
            onClick={goToLogin}
          >
            Sign In
          </button>
          <button
            className="w-44 mt-5 rounded-2xl h-10 font-semibold border-solid border-2 border-black"
            onClick={goToHome}
          >
            Home
          </button>
        </div>
        <div className="w-2/3 h-screen flex flex-col place-content-center">
          <h2 className="text-4xl flex w-full mb-5 justify-center font-bold">
            Register
          </h2>
          <div className="w-full h-fit mt-5">
            <form
              className="w-full flex flex-col justify-center items-center"
              onSubmit={handleRegistration}
            >
              <div className="w-full flex justify-around mb-6">
                <input
                  className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                  type="text"
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                  type="text"
                  placeholder="Last Name *"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
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
                <input
                  className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                  type="password"
                  placeholder="Password *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="flex w-full justify-center">
                <button
                  className="w-96 bg-[#76dbcf] rounded-2xl h-10 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";

export const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      let logoutUrl = "http://localhost:8000/api/v1/users/";
      
      // Determine which type of user is logged in
      if (localStorage.getItem("patient")) {
        logoutUrl += "patient/logout";
      } else if (localStorage.getItem("doctor")) {
        logoutUrl += "doctor/logout";
      } else if (localStorage.getItem("admin")) {
        logoutUrl += "admin/logout";
      }

      const res = await axios.get(logoutUrl, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      // Clear all possible storage items
      localStorage.removeItem("authToken");
      localStorage.removeItem("patient");
      localStorage.removeItem("doctor");
      localStorage.removeItem("admin");
      
      setIsAuthenticated(false);
      toast.success(res.data.message);
      navigateTo("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  // Helper functions to check user type
  const isPatient = () => Boolean(localStorage.getItem("patient"));
  const isDoctor = () => Boolean(localStorage.getItem("doctor"));
  const isAdmin = () => Boolean(localStorage.getItem("admin"));

  // Get user data based on role
  const getUserData = () => {
    if (isPatient()) return JSON.parse(localStorage.getItem("patient"));
    if (isDoctor()) return JSON.parse(localStorage.getItem("doctor"));
    if (isAdmin()) return JSON.parse(localStorage.getItem("admin"));
    return null;
  };

  // Get profile link based on role
  const getProfileLink = () => {
    if (isPatient()) return "/patient-home";
    if (isDoctor()) return "/doctor-home";
    if (isAdmin()) return "/admin";
    return "/";
  };

  return (
    <nav className="w-full h-16 flex justify-between items-center px-5">
      <div className="logo w-10">
        <Link to={"/"}>
          <img className="ml-10" src="./image.png" alt="" />
        </Link>
      </div>
      <div className="nav-contains w-1/2 text-xl font-sans font-bold">
        <ul className="flex justify-between">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/appointment"}>Appointment</Link>
          </li>
          <li>
            <Link to={"/aboutus"}>About us</Link>
          </li>
          <li>
            <Link to={"/quick-help"}>Quick Help</Link>
          </li>
        </ul>
      </div>
      {isAuthenticated ? (
        <div className="flex items-center gap-6">
          <button
            className="w-32 h-10 bg-[#76dbcf] rounded-2xl font-semibold"
            onClick={handleLogout}
          >
            LOGOUT
          </button>
          <div className="profile w-14">
            <Link to={getProfileLink()}>
              <img src="/profile.png" alt="" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex">
          <button
            className="w-32 h-10 bg-[#76dbcf] rounded-2xl font-semibold mr-3"
            onClick={() => navigateTo("/register")}
          >
            REGISTER
          </button>
          <button
            className="w-32 h-10 bg-[#76dbcf] rounded-2xl font-semibold"
            onClick={() => navigateTo("/login")}
          >
            LOGIN
          </button>
        </div>
      )}
    </nav>
  );
};

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Appointment from "./Pages/Appointment";
import About from "./Pages/About";
import QuickHelp from "./Pages/QuickHelp";
import Login from "./Pages/login";
import Register from "./Pages/Register";
import DiabetesPredictor from "./Pages/DiabetesPredictor";
import ThyroidPredictor from "./Pages/ThyroidPredictor";
import AdminHome from "./Pages/AdminHome";
import MessagesDisp from "./Pages/MessagesDisp";
import AddAdmin from "./Pages/AddAdmin";
import AddDoctor from "./Pages/AddDoctor";
import Doctors from "./Pages/Doctors";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "./main";
import HeartDiseasePredictor from "./Pages/HeartDiseasePredictor";
import DoctorHome from "./Pages/DoctorHome";
import PatientHome from "./Pages/PatientHome";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/patient/profile",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        // Handle error silently
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/quick-help" element={<QuickHelp />} />
          <Route path="/diabetes-predictor" element={<DiabetesPredictor />} />
          <Route path="/thyroid-predictor" element={<ThyroidPredictor />} />
          <Route path="/heart-disease-predictor" element={<HeartDiseasePredictor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/messages" element={<MessagesDisp />} />
          <Route path="/doctor-addnew" element={<AddDoctor />} />
          <Route path="/admin-addnew" element={<AddAdmin />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patient-home" element={<PatientHome />} />
          <Route path="/doctor-home" element={<DoctorHome />} />
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar";
import AppointForm from "../Components/AppointForm";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import AppointDoctors from "../Components/AppointDoctors";

const Appointment = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const {data} = await axios.get(
          "http://localhost:8000/api/v1/users/doctors",
          {
            withCredentials: true,
          }
        );
        // console.log(data.doctors);
        setDoctors(data.doctors);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);
  const navigateTo = useNavigate();
  const goToLogin = () => {
    navigateTo("/login");
  };
  // const [cards] = useState(doctors)
  // console.log(cards)
  const [showModal, setShowModal] = useState(false);
  function checkToken() {
    const token = localStorage.getItem("authToken");
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  const tokenExists = checkToken();
  // console.log(tokenExists);
  // let df = "";
  // let dl = "";
  // let dd = "";

  return (
    <div className="sec-1 w-full h-full bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      <div className="header w-full flex justify-center mt-7">
        <h1 className="font-semibold text-2xl">Our Doctors</h1>
      </div>
      <div className="doc-details p-5 flex justify-around flex-wrap">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => (
            <AppointDoctors
              key={element._id}
              data={element}
              onClick={handleCardClick}
            />
          ))
        ) : (
          <h1>No Doctors</h1>
        )}
      </div>
      {/* Modal for booking appointment, only shown if selectedCard is set */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Debug: log when modal is shown */}
          {console.log('AppointForm modal open for:', selectedCard)}
          <AppointForm key={selectedCard._id} data={selectedCard} onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default Appointment;

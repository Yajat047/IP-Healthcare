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
      <AppointForm data={selectedCard} onClose={handleCloseModal} />
      {/* <div className="doc-details p-5 flex justify-around flex-wrap">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => {
            return (
              <div
                key={element._id}
                className="flex  bg-white box-border h-fit w-52 rounded-3xl p-4 border-4 shadow-[0_24px_40px_-15px_rgba(0,0,0,0.3)] flex-col items-center mx-14 mb-10"
              >
                <div className="w-28 h-28 rounded-full border-2 border-emerald-300 mb-2">
                  <img src="" alt="" />
                </div>
                <h1 className="text-black font-semibold text-xl ">
                  {element.firstName} {element.lastName}
                </h1>
                <h1 className="text-black font-semibold text-xl">
                  {element.doctorDepartment}
                </h1>
                <button
                  onClick={() => {
                    if (tokenExists) {
                      console.log(element.firstName);
                      setShowModal(true);
                    } else {
                      navigateTo("/login");
                    }
                  }}
                  // onClick={() => {
                  //   setShowModal(true);
                  // }}
                  className="w-40 bg-[#76dbcf] rounded-2xl h-10 font-semibold mt-2"
                >
                  Book Appointment
                </button>
                {showModal && (
                  <AppointForm
                    onClose={() => setShowModal(false)}
                    doc={[
                      element.firstName,
                      element.lastName,
                      element.doctorDepartment,
                    ]}
                  />
                )}
              </div>
            );
          })
        ) : (
          <h1>No Doctors</h1>
        )}
      </div> */}
    </div>
  );
};

export default Appointment;

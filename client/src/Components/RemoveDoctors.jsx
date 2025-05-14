import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

const RemoveDoctors = ({ data }) => {
  const navigateTo = useNavigate();

  const handleRemoveDoctor = async (doctorID) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/v1/users/doctor/${doctorID}`,
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      navigateTo("/admin");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div
      key={data._id}
      className="flex  bg-white box-border h-fit w-52 rounded-3xl p-4 border-4 shadow-[0_24px_40px_-15px_rgba(0,0,0,0.3)] flex-col items-center mx-14 mb-10"
    >
      <div className="w-28 h-28 rounded-full border-2 border-emerald-300 mb-2">
        <img
          className="w-28 h-28 rounded-full"
          src={data.avatar && data.avatar.url}
          alt=""
        />
      </div>
      <h1 className="text-black font-semibold text-xl ">{data.firstName}</h1>
      <h1 className="text-black font-semibold text-xl ">{data.lastName}</h1>
      <h1 className="text-black font-semibold text-xl">
        {data.doctorDepartment}
      </h1>
      <button
        onClick={() => handleRemoveDoctor(data._id)}
        className="w-40 bg-red-500 rounded-2xl h-10 font-semibold text-white mt-2"
      >
        Remove
      </button>
    </div>
  );
};

export default RemoveDoctors;

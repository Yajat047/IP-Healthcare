import React from "react";
import { RiHome2Fill } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { RiAdminFill } from "react-icons/ri";
import { RiUserAddFill } from "react-icons/ri";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { RiLogoutCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = () => {

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/users/admin/logout",
        {
          withCredentials: true, // Include cookies in the request
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res);
      toast.success(res.data.message);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken"); // Remove token from localStorage
      localStorage.removeItem("admin");
      navigateTo("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const navigateTo = useNavigate();

  const HomePage = () => {
    navigateTo("/admin");
  };
  const DoctorsPage = () => {
    navigateTo("/doctors");
  };
  const MessagesPage = () => {
    navigateTo("/messages");
  };
  const AddNewDoctor = () => {
    navigateTo("/doctor-addnew");
  };
  const AddNewAdmin = () => {
    navigateTo("/admin-addnew");
  };

  return (
    <div className="flex w-16 h-screen justify-center items-center ml-4">
      <div className="nav fixed h-4/5 w-14 bg-[#76dbcf] rounded-full flex flex-col items-center py-7 justify-between">
        <RiHome2Fill size={35} onClick={HomePage} />
        <RiAdminFill size={35} onClick={AddNewAdmin} />
        <FaUserDoctor size={35} onClick={DoctorsPage} />
        <RiUserAddFill size={35} onClick={AddNewDoctor}/>
        <BiSolidMessageSquareDetail size={35} onClick={MessagesPage} />
        <RiLogoutCircleFill size={35} onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;

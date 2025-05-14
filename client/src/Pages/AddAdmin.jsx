import React from "react";
import Sidebar from "../Components/Sidebar";
import { useContext } from "react";
import { useState } from "react";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:8000/api/v1/users/admin/add",
          // add the route here and keep the localhost url commented
          { firstName, lastName, email, phone, nic, dob, gender, password },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/admin");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setNic("");
          setDob("");
          setGender("");
          setPassword("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full add-admin flex">
        <div className="w-full h-fit pl-7 pt-7 pr-7">
          {/* <div className="requests w-full h-fit bg-sky-100 rounded-2xl px-5 py-3 mb-5">
            <h1 className="font-semibold text-xl">Pending Requests</h1>
          </div> */}
          <div className="add-admin-form bg-white w-full h-fit rounded-2xl px-5 py-3 flex flex-col items-center">
            <h1 className="font-semibold text-3xl mt-3 mb-5">Add New Admin</h1>
            <div className="w-full h-fit mb-10">
              <form onSubmit={handleAddNewAdmin}>
                <div className="flex justify-around mb-6">
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="flex justify-around mb-6">
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="number"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex justify-around mb-6">
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="text"
                    placeholder="Aadhar No."
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                  />
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="text"
                    placeholder="Date Of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="flex justify-around mb-6">
                  <label className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4">
                    <select
                      className="w-fit h-10 bg-zinc-200 rounded-2xl  border-0"
                      name="selectedGender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option className="w-fit" value="">
                        Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="nosay">prefer not to say</option>
                    </select>
                  </label>
                  <input
                    className="w-1/3 h-10 bg-zinc-200 rounded-2xl px-4"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex w-full justify-center">
                  <button
                    className="w-96 bg-[#76dbcf] rounded-2xl h-10 font-semibold"
                    type="submit"
                  >
                    ADD NEW ADMIN
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

export default AddAdmin;

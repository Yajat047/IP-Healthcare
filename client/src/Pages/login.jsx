import React, { useContext, useState } from "react";
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoRemoveOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { 
          email, 
          password,
          confirmPassword: password
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      
      // Store user data based on role from database
      switch (user.role) {
        case "Patient":
          localStorage.setItem("patient", JSON.stringify(user));
          navigateTo("/patient-home");
          break;
        case "Doctor":
          localStorage.setItem("doctor", JSON.stringify(user));
          navigateTo("/doctor-home");
          break;
        case "Admin":
          localStorage.setItem("admin", JSON.stringify(user));
          navigateTo("/admin");
          break;
        default:
          navigateTo("/");
      }

      toast.success(response.data.message);
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, redirect based on role
  if (isAuthenticated) {
    if (localStorage.getItem("patient")) return <Navigate to="/patient-home" />;
    if (localStorage.getItem("doctor")) return <Navigate to="/doctor-home" />;
    if (localStorage.getItem("admin")) return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }

  const goToHome = () => navigateTo("/");

  return (
    <>
      <div className="flex">
        <div className="w-1/3 h-screen bg-[#76dbcf] flex flex-col place-content-center items-center rounded-r-full">
          <h2 className="text-4xl flex w-full justify-center font-bold">
            Hello, Welcome Back!!
          </h2>
          <IoRemoveOutline size={80} />
          <p className="text-2xl flex w-full justify-center mb-6">
            New Here !!!
          </p>
          <button
            className="w-40 rounded-2xl h-10 font-semibold border-solid border-2 border-black"
            onClick={() => navigateTo("/register")}
          >
            Sign Up
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
            Sign In
          </h2>
          <div>
            <form
              className="flex flex-col justify-center items-center"
              onSubmit={handleLogin}
            >
              <div className="flex items-center w-72 h-10 bg-zinc-200 px-5 rounded-2xl mb-6">
                <MdOutlineMailLock className="ml-4" />
                <input
                  className="bg-zinc-200 h-10 px-5 outline-none w-full"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center w-72 h-10 bg-zinc-200 px-5 rounded-2xl mb-6">
                <RiLockPasswordLine className="ml-4" />
                <input
                  className="bg-zinc-200 h-10 px-5 outline-none w-full"
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button
                className="w-40 bg-[#76dbcf] rounded-2xl h-10 font-semibold disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

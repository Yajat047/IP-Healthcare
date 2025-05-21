import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="flex justify-around pb-7">
      <div className="">
        <h4 className="text-lg font-semibold">Quick Links</h4>
        <ul>
          <li>
            <Link to="/" className="text-slate-600 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/appointment"
              className="text-slate-600 hover:underline"
            >
              Book Appointment
            </Link>
          </li>
          <li>
            <Link to="/aboutus" className="text-slate-600 hover:underline">
              About us
            </Link>
          </li>
        </ul>
      </div>
      <div className="">
        <h4 className="text-lg font-semibold">Contact Us</h4>
        <ul>
          <li className="flex items-center">
            <img
              src="/phone-call_597177.png"
              alt=""
              className="w-4 h-4"
            />
            <h6 className="text-slate-600">&nbsp;9999999999</h6>
          </li>
          <li className="flex items-center">
            <img src="/email.png" alt="" className="w-4 h-4" />
            <h6 className="text-slate-600">&nbsp;name@gmail.com</h6>
          </li>
          <li className="flex items-center">
            <img src="/pin.png" alt="" className="w-4 h-4" />
            <h6 className="text-slate-600">&nbsp;Chandigarh,India</h6>
          </li>
        </ul>
      </div>
      <div className="">
        <h4 className="text-lg font-semibold">Follow Us</h4>
        <ul>
          <li className="flex items-center mb-2">
            <img src="/email.png" alt="Email" className="w-4 h-4" />
            <span className="text-slate-600">&nbsp;info@healthcare.com</span>
          </li>
          <li className="flex items-center mb-2">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" className="w-4 h-4" />
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:underline">&nbsp;Instagram</a>
          </li>
          <li className="flex items-center mb-2">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" className="w-4 h-4" />
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:underline">&nbsp;LinkedIn</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

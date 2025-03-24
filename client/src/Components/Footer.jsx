import React from "react";

export const Footer = () => {
  return (
    <div className="flex justify-around pb-7">
      <div className="">
        <h4 className="text-lg font-semibold">Quick Links</h4>
        <ul>
          <h6 className="text-slate-600">Home</h6>
          <h6 className="text-slate-600">Appointment</h6>
          <h6 className="text-slate-600">About us</h6>
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
            <h6 className="text-slate-600">&nbsp;Burdwan,WB</h6>
          </li>
        </ul>
      </div>
      <div className="">
        <h4 className="text-lg font-semibold">Hours</h4>
        <ul>
          <h6 className="text-slate-600">
            Monday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;09am-11pm
          </h6>
          <h6 className="text-slate-600">
            Tuesday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10am-11pm
          </h6>
          <h6 className="text-slate-600">
            Wednesday&nbsp;&nbsp;&nbsp;10am-11pm
          </h6>
          {/* <h6 className="text-slate-600">
            Thursday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11am-9pm
          </h6> */}
          <h6 className="text-slate-600">
            Friday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11am-10pm
          </h6>
          <h6 className="text-slate-600">
            Saturday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12pm-9pm
          </h6>
          <h6 className="text-slate-600">
            Sunday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12pm-9pm
          </h6>
        </ul>
      </div>
    </div>
  );
};

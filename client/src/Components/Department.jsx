import React from "react";
import { useContext } from "react";
import { Context } from "../main";
import { useState } from "react";

export const Department = ({ data }) => {
  const dep = data;
  return (
    <div className="flex bg-white box-border h-60 w-52 rounded-3xl p-4 border-4 shadow-[0_24px_40px_-15px_rgba(0,0,0,0.3)] flex-col items-center mx-14 mb-10 group">
      <button className="w-40 h-40 rounded-full border-2 border-emerald-300 overflow-hidden">
        <img
          src={dep.img}
          alt={dep.dept}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </button>
      <h4 className="text-black font-semibold text-2xl mt-2">{dep.dept}</h4>
    </div>
  );
};

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const MessagesDisp = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/message/get-all-msg",
          {
            withCredentials: true
          }
        );
        console.log(data.messages);
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchMessages();
  }, []);
  return (
    <div className="flex">
      <Sidebar />
      <section className="page messages p-7 mt-10 w-full">
        <h1 className="font-semibold text-3xl mb-3">MESSAGE</h1>
        <div className="banner flex w-full items-center flex-wrap gap-5 flex-col-reverse">
          {messages && messages.length > 0 ? (
            messages.map((element) => {
              return (
                <div className=" w-10/12 h-fit flex-shrink-0" key={element._id}>
                  <div className=" w-auto h-fit bg-sky-100 rounded-2xl p-5">
                    <h1 className="font-semibold text-xl">
                      First Name : <span>{element.firstName}</span>
                    </h1>
                    <h1 className="font-semibold text-xl">
                      Last Name : <span>{element.lastName}</span>
                    </h1>
                    <h1 className="font-semibold text-xl">
                      Email : <span>{element.email}</span>
                    </h1>
                    <h1 className="font-semibold text-xl">
                      Phone no. : <span>{element.phone}</span>
                    </h1>
                    <h1 className="font-semibold text-xl">
                      Message : <span>{element.message}</span>
                    </h1>
                  </div>
                </div>
              );
            })
          ) : (
            <h1>No Messages!</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default MessagesDisp;

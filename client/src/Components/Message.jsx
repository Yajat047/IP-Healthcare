import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Message = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:8000/api/v1/message/send",
          { firstName, lastName, email, phone, message },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setMessage("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full px-48">
      <div className="msg-form w-full h-fit rounded-3xl bg-white my-9 py-12 px-36">
        <form onSubmit={handleMessage}>
          <div className="flex justify-between mb-3">
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex justify-between mb-3">
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-96 h-10 bg-zinc-200 rounded-2xl px-4"
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="w-full">
            <textarea
              className="w-full h-40 bg-zinc-200 rounded-2xl px-4 py-3 mb-7"
              rows={7}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-center">
            <button
              className="w-32 h-10 bg-[#76dbcf] rounded-2xl font-semibold"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Message;

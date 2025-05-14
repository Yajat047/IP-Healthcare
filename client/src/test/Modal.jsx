import React from "react";

const Modal = ({ data, onClose }) => {
  if (!data) return null;
  console.log(data)

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>{data.title}</h3>
        <p>{data.description}</p>
      </div>
    </div>
  );
};

export default Modal;

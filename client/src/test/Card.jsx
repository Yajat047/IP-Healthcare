import React from "react";

const Card = ({ data, onClick }) => {
  return (
    <div className="card" onClick={() => onClick(data)}>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
    </div>
  );
};

export default Card;

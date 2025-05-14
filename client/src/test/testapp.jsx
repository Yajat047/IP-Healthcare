import React, { useState } from "react";
import Card from "./Card";
import Modal from "./Modal";

const testapp = () => {
  const [cards] = useState([
    { id: 1, title: "Card 1", description: "Description for Card 1" },
    { id: 2, title: "Card 2", description: "Description for Card 2" },
    // Add more card objects as needed
  ]);

  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <div className="app">
      <div className="card-container">
        {cards.map((card) => (
          <Card key={card.id} data={card} onClick={handleCardClick} />
        ))}
      </div>
      <Modal data={selectedCard} onClose={handleCloseModal} />
    </div>
  );
};

export default testapp;

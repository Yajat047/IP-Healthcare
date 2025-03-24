import React, { useState, useEffect } from "react";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Append the external script to the document
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("chatbotId", "LSpRknp6r-QVgWm2eZYwj");
    script.setAttribute("domain", "www.chatbase.co");
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-72 max-w-full z-50">
      {/* <button
        className="bg-blue-600 text-white rounded-full px-4 py-2 shadow-md hover:bg-blue-700 transition duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close Chat" : "Chat with us"}
      </button> */}
      {isOpen && (
        <div className="mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-300">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/LSpRknp6r-QVgWm2eZYwj"
            width="100%"
            style="height: 100%; min-height: 700px"
            frameborder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
import React, { useEffect } from "react";

const ChatBubble = () => {
  useEffect(() => {
    // Append the external script to the document
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("chatbotId", "_ZS9dC7xYo97lp-2FJVdH");
    script.setAttribute("domain", "www.chatbase.co");
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default ChatBubble;
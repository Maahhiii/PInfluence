import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const Chatbox = () => {
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [messages, setMessages] = useState([
    { text: "Hey! Check this out.", sender: "user" },
    { text: "Wow, love it!", sender: "other" },
    {
      sender: "user",
      pin: {
        title: "Pink Sneakers",
        image: "/images/image1.jpg",
        link: "https://example.com/pink-sneakers",
      },
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { text: newMessage, sender: "user" }]);
    setNewMessage("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatList selectedId={selectedChatId} onSelect={setSelectedChatId} />
      <ChatWindow
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
      />
    </div>
  );
};

export default Chatbox;

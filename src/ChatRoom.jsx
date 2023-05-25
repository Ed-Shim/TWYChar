// ChatRoom.jsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// Add other imports as necessary...

const ChatRoom = () => {
  const [messages, setMessages] = useState(["Thanks for creating me!"]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  const handleSendMessage = () => {
    setMessages([...messages, newMessage]);
    setNewMessage("");
  };

  const handleLeaveRoom = () => {
    navigate("/");
  };

  return (
    <div>
      <Button onClick={handleLeaveRoom}>Leave Room</Button>
      <div>
        {messages.map((message, index) => (
          <Typography key={index}>{message}</Typography>
        ))}
      </div>
      <TextField value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <Button onClick={handleSendMessage}>Send</Button>
    </div>
  );
};

export default ChatRoom;

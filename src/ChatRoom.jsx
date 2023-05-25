import { useEffect, useState } from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useLocation } from 'react-router-dom';

const ChatRoom = ({ botPicture }) => {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello, how can I help you?' }]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const botIcon = location.state.botIcon;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: 'user', text: newMessage }]);
      setNewMessage("");
    }
  };

  // Mimic bot responses for the demo
  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender !== 'bot') {
      setTimeout(() => {
        setMessages([...messages, { sender: 'bot', text: 'Sorry, I am not capable of real conversation yet.' }]);
      }, 1000);
    }
  }, [messages]);

  const closeConversation = () => {
    navigate('/');
  };


  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ overflowY: 'scroll' }}>
        {messages.map((message, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
            {message.sender === 'bot' && <Avatar src={botPicture} sx={{ margin: 2 }} />}
            <Box
              sx={{
                padding: 2,
                margin: 2,
                borderRadius: 2,
                backgroundColor: message.sender === 'user' ? '#3f51b5' : '#e0e0e0',
                color: message.sender === 'user' ? '#ffffff' : '#000000',
                maxWidth: '60%',
                wordBreak: 'break-word'
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, borderTop: '1px solid #ddd', position: 'sticky', bottom: 0, backgroundColor: '#fff' }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <IconButton onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: 2 }}>
        <Button variant="outlined" color="secondary" onClick={closeConversation}>Close Conversation</Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;

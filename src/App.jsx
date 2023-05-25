import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateCharacter from './CreateCharacter';
import ChatRoom from './ChatRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateCharacter />} />
        <Route path="/chatroom" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



import {ChatPage,generateanswer} from './pages/chatpage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Image from './pages/image.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element ={<Image/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App

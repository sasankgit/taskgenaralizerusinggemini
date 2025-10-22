

import {ChatPage,generateanswer} from './pages/chatpage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ImageUpload from './pages/image.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element ={<ImageUpload/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App

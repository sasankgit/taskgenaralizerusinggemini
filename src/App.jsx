import './index.css'
  import { useState, useEffect } from 'react'
  import { supabase } from './supabase.js';
  import { Auth } from '@supabase/auth-ui-react'
  import { ThemeSupa } from '@supabase/auth-ui-shared'
  import {BrowserRouter,Routes,Route} from 'react-router-dom'


  //pages
  import Home from "./pages/home"
  import ImageUpload from './pages/image'
  import ChatPage from './pages/chatpage.jsx';







  //pages end



  export default function App() {
    const [session, setSession] = useState(null)

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }, [])

    if (!session) {
      return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
    }
    else {
      return (
       <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element ={<Home/>}/>
            <Route path='/image' element={<ImageUpload/>}/>
            <Route path='/gemini' element={<ChatPage/>}/>

          </Routes>
        </BrowserRouter>
        
      </div>
      )
    }
  }
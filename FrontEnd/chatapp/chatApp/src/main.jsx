import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AppRoutes from './Config/Routes.jsx'
import { Toaster } from 'react-hot-toast'
import JoinCreateChat from './Components/JoinCreateChat.jsx'
import ChatPage from './Components/ChatPage.jsx'
import { ChatProvider } from './Context Api/ChatContext.jsx'




createRoot(document.getElementById('root')).render(

   
  <BrowserRouter>
    <ChatProvider>
    <AppRoutes/>
    <Toaster/>
    </ChatProvider>
  </BrowserRouter>
 
)

import React from 'react'
import { Routes , Route } from 'react-router'
import App from '../App'
import ChatPage from '../Components/ChatPage'
import JoinCreateChat from '../Components/JoinCreateChat'

function AppRoutes() {
  return (
  
    <Routes>
      <Route path="" element ={<JoinCreateChat/>}/>
      <Route path="/chat" element ={<ChatPage/>}/>
      <Route path="/app" element ={<App/>}/>
     </Routes>
   
  )
}

export default AppRoutes
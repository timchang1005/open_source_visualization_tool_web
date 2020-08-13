import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { BrowserRouter } from 'react-router-dom';
import './App.css'

export default function App () {

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Header toggleSidebar={() => {setMobileSidebarOpen(!isMobileSidebarOpen)}}/>
        <Sidebar onMobileClose={() => setMobileSidebarOpen(false)} openMobile={isMobileSidebarOpen} />
        <div>
          world
        </div>
      </BrowserRouter>

    </div>
  )
}

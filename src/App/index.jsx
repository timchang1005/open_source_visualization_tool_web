import React, { useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Header'
import Sidebar from './Sidebar'
import Home from './Home'
import Login from './Login'
import './App.css'

export default function App () {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="App">
      <BrowserRouter>
        <Header
          toggleSidebar={() => {setSidebarOpen(!isSidebarOpen)}}
          isSidebarButtonVisible={!isSidebarOpen}
        />
        <Sidebar onClose={() => setSidebarOpen(false)} isOpen={isSidebarOpen} />
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/" component={Home}/>
        </Switch>
        <div>
          world
        </div>
      </BrowserRouter>
    </div>
  )
}

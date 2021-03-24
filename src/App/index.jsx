import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainView from './components/MainView'
import AllRoutes from './../routes/AllRoutes'
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  app: {
    display: 'flex'
  },
  headerSpace: {
    ...theme.mixins.toolbar,
  },
  main: {
    width: `calc(100%)`
  }
}))

export default function App () {
  const classes = useStyle()

  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={classes.app}>
      <BrowserRouter>
        <Header
          toggleSidebar={() => {setSidebarOpen(!isSidebarOpen)}}
          isSidebarButtonVisible={!isSidebarOpen}
        />
        <Sidebar onClose={() => setSidebarOpen(false)} isOpen={isSidebarOpen}/>
        <main className={classes.main}>
          <div className={classes.headerSpace}/>
          <MainView>
            <AllRoutes/>
          </MainView>
        </main>
      </BrowserRouter>
    </div>
  )
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: 256,
    width: 'calc(100% - 256px)',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  }
}));

function Header({ toggleSidebar, isSidebarButtonVisible }) {
  const classes = useStyles();

  return (
      <AppBar 
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: !isSidebarButtonVisible,
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={clsx({
              [classes.hide]: !isSidebarButtonVisible
            })}
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <MenuIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
  )
}

Header.defaultProps = {
  isSidebarButtonVisible: true
}

export default Header;
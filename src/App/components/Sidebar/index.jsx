import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, IconButton, Divider } from '@material-ui/core';
import { ChevronLeft, ExitToApp, AccountCircle } from '@material-ui/icons'
import SidebarItem from './SidebarItem'
import clsx from 'clsx'
import { logout } from '../../../redux/actions';
import { connect } from 'react-redux'
import routes from '../../../routes/Routes';
import {
  BiLogOut as LogOutIcon,
  BiLogIn as LogInIcon,
} from 'react-icons/bi';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 256,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: 256,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  sidebar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

function Sidebar({ onClose, isOpen, isLoggedIn, logout }) {
  const classes = useStyles();


  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: isOpen,
        [classes.drawerClose]: !isOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: isOpen,
          [classes.drawerClose]: !isOpen,
        }),
      }}
    >
      <div className={classes.sidebar}>
        <IconButton onClick={onClose}>
          <ChevronLeft />
        </IconButton>
      </div>
      <Divider />
      <List >
        {routes
          .filter((item) => item.sidebarIcon)
          .map((item) => (
          isLoggedIn && <SidebarItem href={item.path} key={item.title} title={item.title} icon={item.sidebarIcon}/>
        ))}
        {(isLoggedIn && <ListItem button onClick={logout}>
          <ListItemIcon>
            <LogOutIcon size={25}/>
          </ListItemIcon>
          <ListItemText primary="Logout"/>
        </ListItem>) ||
        <SidebarItem href="/login" title="Login" icon={LogInIcon}/>}
      </List>
    </Drawer>
  )
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.userInfo.isLoggedIn
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

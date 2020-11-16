import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { List, Drawer, IconButton, Divider } from '@material-ui/core';
import { ChevronLeft, Inbox, Mail } from '@material-ui/icons'
import SidebarItem from './SidebarItem'
import clsx from 'clsx'

const items = [
  {
    href: '/',
    icon: Inbox,
    title: 'Dashboard'
  },
  {
    href: '/',
    icon: Mail,
    title: 'Customers'
  },
]

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

function Sidebar({ onClose, isOpen }) {
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
        {items.map((item) => (
          <SidebarItem href={item.href} key={item.title} title={item.title} icon={item.icon}/>
        ))}
      </List>
    </Drawer>
  )
}

Sidebar.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool
};

export default Sidebar;
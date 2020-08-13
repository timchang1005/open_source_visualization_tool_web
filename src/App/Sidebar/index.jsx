import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { List, Hidden, Drawer, Box } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SidebarItem from './SidebarItem'

const items = [
  {
    href: '/',
    icon: InboxIcon,
    title: 'Dashboard'
  },
  {
    href: '/',
    icon: MailIcon,
    title: 'Customers'
  },
]

const useStyles = makeStyles({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
});

function Sidebar({ onMobileClose, openMobile }) {
  const classes = useStyles();
  
  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box p={2}>
        <List>
          {items.map((item) => (
            <SidebarItem href={item.href} key={item.title} title={item.title} icon={item.icon}/>
          ))}
        </List>
      </Box>
    </Box>
  )

  return (
    <div>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </div>
  )
}

Sidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

Sidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default Sidebar;
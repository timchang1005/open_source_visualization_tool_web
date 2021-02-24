import React, { forwardRef, useMemo } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Link } from 'react-router-dom'

function SidebarItem({ href, icon: Icon, title }) {
  const ListItemLink = useMemo(() =>
    forwardRef((linkProps, ref) => (
      <Link ref={ref} to={href} {...linkProps}/>
    )), [href]
  )
  return (
    <ListItem button component={ListItemLink}>
      <ListItemIcon>
        <Icon/>
      </ListItemIcon>
      <ListItemText primary={title}/>
    </ListItem>
  )
}

export default SidebarItem;
import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

const SidebarItem = ({
  className,
  href,
  icon: Icon,
  title,
}) => {

  return (
    <ListItem button to={href}>
      <ListItemIcon>
        <Icon/>
      </ListItemIcon>
      <ListItemText primary={title}/>
    </ListItem>
  )
}

SidebarItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
}

export default SidebarItem;
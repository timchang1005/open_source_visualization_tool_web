import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button, IconButton, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Header({ toggleSidebar }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Hidden lgUp>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleSidebar}
            >
              <MenuIcon/>
            </IconButton>
          </Hidden>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

Header.propTypes = {
  toggleSidebar: PropTypes.func
}

export default Header;
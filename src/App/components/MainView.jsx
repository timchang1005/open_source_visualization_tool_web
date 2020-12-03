import React from 'react';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5),
  }
}))

export default function MainView({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {children}
    </div>
  )
}
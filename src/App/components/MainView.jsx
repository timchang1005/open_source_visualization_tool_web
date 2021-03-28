import React from 'react';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mainView: {
    padding: theme.spacing(10),
  }
}))

export default function MainView({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.mainView}>
      {children}
    </div>
  )
}
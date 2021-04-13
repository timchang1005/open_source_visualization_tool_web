import React from 'react';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mainView: {
    padding: theme.spacing(10),
    paddingTop: theme.spacing(5),
    "& h2": {
      textAlign: "center"
    }
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
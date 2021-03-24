import React from 'react';
import { makeStyles } from "@material-ui/core";
import SearchTool from './SearchTool'

const useStyles = makeStyles((theme) => ({
  mainView: {
    padding: theme.spacing(10),
  }
}))

export default function MainView({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.mainView}>
      <SearchTool/>
      {children}
    </div>
  )
}
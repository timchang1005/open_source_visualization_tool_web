import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  loadingView: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: theme.zIndex.tooltip,
    background: "#ffffff80"
  }
}))


function LoadingView({ visible }) {
  const classes = useStyle()

  return (
    visible && <div className={classes.loadingView}>
      <CircularProgress/>
    </div>
  )
}

export default LoadingView;
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.tooltip,
    color: '#fff',
  }
}))


function LoadingView({ visible }) {
  const classes = useStyle()

  return (
    <Backdrop className={classes.backdrop} open={visible}>
      <CircularProgress color="inherit"/>
    </Backdrop>
  )
}

export default LoadingView;
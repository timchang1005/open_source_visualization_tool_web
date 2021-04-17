import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.tooltip,
    color: '#fff',
  },
  content: {
    display: "block",
    textAlign: "center"
  },
  message: {
    visibility: "hidden"
  }
}))

function LoadingView({ visible }) {
  const [isOverFiveSeconds, setIsOverFiveSeconds] = useState(false);
  const classes = useStyle()

  useEffect(() => {
    if (visible) {
      setIsOverFiveSeconds(false)
      setTimeout(() => setIsOverFiveSeconds(true), 3000)
    }
  }, [visible])

  return (
    <Backdrop className={classes.backdrop} open={visible}>
      <div className={classes.content}>
        <CircularProgress color="inherit"/>
        <p className={!isOverFiveSeconds && classes.message}>It might take some time...</p>
      </div>
    </Backdrop>
  )
}

export default LoadingView;
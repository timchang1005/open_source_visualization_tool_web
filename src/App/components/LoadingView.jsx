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
  const [isOverThreeSeconds, setIsOverThreeSeconds] = useState(false);
  const classes = useStyle()

  useEffect(() => {
    if (visible) {
      setIsOverThreeSeconds(false)
      setTimeout(() => setIsOverThreeSeconds(true), 4000)
    }
  }, [visible])

  return (
    <Backdrop className={classes.backdrop} open={visible}>
      <div className={classes.content}>
        <CircularProgress color="inherit"/>
        <p className={isOverThreeSeconds ? undefined : classes.message}>It might take some time...</p>
      </div>
    </Backdrop>
  )
}

export default LoadingView;
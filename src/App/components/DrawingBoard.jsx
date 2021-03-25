import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';

const useStyles = makeStyles(theme => ({
  drawingBoard: {
    padding: theme.spacing(5),
    height: 600
  }
}))

export default function DrawingBoard() {
  const classes = useStyles();

  const data = {
    labels: ['a', 'b', 'c', 'd', 'e'],
    datasets: [
      {
        label: 'AAA',
        data: [5, 4, 3, 2, 1],
        fill: false,
        borderColor: "#84abd6",
      },
      {
        label: 'BBB',
        data: [3, 5, 1, 4, 2],
        fill: false,
        borderColor: "ff97ba"
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }

  return (
    <div className={classes.drawingBoard}>
      <Line data={data} options={options}/>
    </div>
  )
}
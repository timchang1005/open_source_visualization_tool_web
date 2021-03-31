import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';

const useStyles = makeStyles(theme => ({
  lineChart: {
    padding: theme.spacing(5),
    height: 600
  }
}))

export default function LineChart({ datas }) {
  const classes = useStyles();
  const [data, setData] = useState({labels: [], datasets: []})

  useEffect(() => {
    const { labels, datasets } = datas 
    setData({
      labels: labels,
      datasets: Object.entries(datasets).map(([repoName, commitCounts]) => (
        {
          label: repoName,
          data: commitCounts,
          fill: false,
        }
      ))
    })
  }, [datas])

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
    <div className={classes.lineChart}>
      <Line data={data} options={options}/>
    </div>
  )
}
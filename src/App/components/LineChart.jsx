import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  lineChart: {
    padding: theme.spacing(5),
    height: 600
  }
}))

function LineChart({ datas, repoColor, fill }) {
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
          fill: fill === true,
          borderColor: repoColor[repoName]
        }
      ))
    })
  }, [datas, repoColor, fill])

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
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      xPadding: 10,
      yPadding: 10,
      titleMarginBottom: 10,
      bodySpacing: 10,
    }
  }

  return (
    <div className={classes.lineChart}>
      <Line data={data} options={options}/>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    repoColor: state.repoColor
  }
}

export default connect(mapStateToProps, null)(LineChart);
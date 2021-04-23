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

function LineChart({ datas, repoColor, fill, forContributor }) {
  const classes = useStyles();
  const [data, setData] = useState({labels: [], datasets: []})

  useEffect(() => {
    const { labels, datasets } = datas 
    setData({
      labels: labels,
      datasets: Object.entries(datasets).filter(([label]) => label !== "total").map(([label, values]) => (
        {
          label: label,
          data: values,
          fill: fill === true,
          borderColor: datas.colors === undefined ? repoColor[label] : datas.colors[label],
          ...datas.colors && { backgroundColor: datas.colors[label] }
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
      ...(forContributor && {
        itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
        callbacks: {
          label: (tooltipItem, data) => {
            const total = datas.datasets.total[tooltipItem.index]
            const label = data.datasets[tooltipItem.datasetIndex].label
            const value = tooltipItem.datasetIndex === 0 ? 
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] :
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] - data.datasets[tooltipItem.datasetIndex-1].data[tooltipItem.index]
            return `${label}: ${value} (${parseInt((value/total).toFixed(2)*100)}%)`
          },
          footer: (tooltipItem, data) => {
            const total = datas.datasets.total[tooltipItem[0].index]
            const others = datas.datasets.total[tooltipItem[0].index] - data.datasets[data.datasets.length-1].data[tooltipItem[0].index]
            return `\nOthers: ${others} (${parseInt((others/total).toFixed(2)*100)}%)\n\nTotal: ${total}`
          }
        }
      }),
    },
    legend: {
      reverse: forContributor === true
    },
    onClick: (event, element) => {
      console.log(event)
      console.log(element)
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
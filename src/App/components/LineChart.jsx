import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';

Array.prototype.reverseIf = function (condition) {
  return condition ? this.reverse() : this
}

const useStyles = makeStyles(theme => ({
  lineChart: {
    padding: theme.spacing(5),
    height: 600
  }
}))

function LineChart({ datas, repoColor, fill, cumulative }) {
  const classes = useStyles();
  const [data, setData] = useState({labels: [], datasets: []})
  const [totalData, setTotalData] = useState([])

  useEffect(() => {
    const { labels, datasets } = datas 
    setData({
      labels: labels,
      datasets: Object.entries(datasets).filter(([label]) => label !== "total").map(([label, values], dataIndex, allData) => (
        {
          label: label,
          data: cumulative !== true ?
            values : 
            values.map((_, valueIndex) => allData.slice(dataIndex).reduce((accumulator, [_, dataValues]) => accumulator + dataValues[valueIndex], 0)),
          fill: fill === true,
          borderColor: datas.colors === undefined ? repoColor[label] : datas.colors[label],
          ...datas.colors && { backgroundColor: datas.colors[label] }
        }
      )).reverseIf(cumulative)
    })
    setTotalData(
      datasets?.total ?? labels.map((_, index) => 
        Object.entries(datasets).reduce((accumulator, [_, values]) => accumulator + values[index], 0)
      )
    )
  }, [datas, repoColor, fill])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          ticks: {
            fontSize: 30
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0,
            fontSize: 30
          },
        }
      ],
    },
    tooltips: {
      backgroundColor: "rgba(0,0,0,0.4)",
      mode: 'index',
      intersect: false,
      position: "nearest",
      xPadding: 10,
      yPadding: 10,
      caretX: 100,
      titleMarginBottom: 10,
      bodySpacing: 10,
      titleFontSize: 20,
      bodyFontSize: 20,
      footerFontSize: 20,
      ...(cumulative && {
        itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
        callbacks: {
          label: (tooltipItem, data) => {
            const total = totalData[tooltipItem.index]
            const label = data.datasets[tooltipItem.datasetIndex].label
            const value = tooltipItem.datasetIndex === 0 ? 
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] :
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] - data.datasets[tooltipItem.datasetIndex-1].data[tooltipItem.index]
            return `${label}: ${value} (${parseInt((value/total).toFixed(2)*100)}%)`
          },
          footer: (tooltipItem, data) => {
            const total = totalData[tooltipItem[0].index]
            const others = total - data.datasets[data.datasets.length-1].data[tooltipItem[0].index]
            return others ? 
              `\nOthers: ${others} (${parseInt((others/total).toFixed(2)*100)}%)\n\nTotal: ${total}` :
              `\nTotal: ${total}`
          }
        }
      }),
    },
    legend: {
      reverse: cumulative === true,
      labels: {
        fontSize: 35,
      },
    },
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
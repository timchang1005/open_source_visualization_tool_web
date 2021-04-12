import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import SearchTool from '../components/SearchTool';
import LoadingView from '../components/LoadingView';
import { connect } from 'react-redux';
import axios from 'axios';

function Issues({ repositories, accessToken }) {
  const [commitChartData, setCommitChartData] = useState({datasets: {}, labels: []})
  const [isLoading, setIsLoading] = useState(false)

  const getIssuesClassifiedWithMonth = (repo) => {
    const [repoOwner, repoName] = repo.split('/')
    return axios.post(`http://localhost:5000/api/v1/issues`, {repoOwner, repoName, accessToken})
      .then(() => (
        axios.get(`http://localhost:5000/api/v1/issues?repoOwner=${repoOwner}&repoName=${repoName}`)
          .then(({ data: issues }) => {
            let minMonth = "9999-12"
            let maxMonth = "1970-01"
            let result = issues.reduce((accumulator, current) => {
              let createdMonth = current.createdAt.substr(0, 7)
              if(createdMonth in accumulator) {
                accumulator[createdMonth][0] += 1
              } else {
                accumulator[createdMonth] = [1, 0]
                if(createdMonth > maxMonth) maxMonth = createdMonth
                if(createdMonth < minMonth) minMonth = createdMonth
              }
              if (current.closedAt != null) {
                let closedMonth = current.closedAt.substr(0, 7)
                if(closedMonth in accumulator) {
                  accumulator[closedMonth][1] += 1
                } else {
                  accumulator[closedMonth] = [0, 1]
                  if(closedMonth > maxMonth) maxMonth = closedMonth
                  if(closedMonth < minMonth) minMonth = closedMonth
                }
              }
              return accumulator
            }, {})
            let tempMonth = new Date(...minMonth.split('-').map(str => parseInt(str)))
            while(tempMonth.toISOString().substr(0, 7) < maxMonth) {
              if(!(tempMonth.toISOString().substr(0, 7) in result)) {
                result[tempMonth.toISOString().substr(0, 7)] = [0, 0]
              }
              tempMonth.setMonth(tempMonth.getMonth() + 1)
            }
            return {
              name: repo,
              issues: result
            }
          })
      ))
  }

  useEffect(() => {
    if(repositories.length > 0) {
      setIsLoading(true)
      getIssuesClassifiedWithMonth(repositories[0])
        .then( repo => {
          let months = Object.keys(repo.issues).sort()
          let issues = months.map(month => repo.issues[month])
          setCommitChartData({
            labels: months,
            datasets: {
              created: issues.map(issue => issue[0]).map((sum => value => sum += value)(0)), 
              closed : issues.map(issue => issue[1]).map((sum => value => sum += value)(0))
            }
          })
          setIsLoading(false)
        })
    } else {
      setCommitChartData({
        labels: [],
        datasets: {}
      })
    }
  }, [repositories])

  return (
    <div>
      <p>Issues</p>
      <LoadingView visible={isLoading}/>
      <SearchTool/>
      <LineChart datas={commitChartData} fill={true}/>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    repositories: state.searchCondition.repositories,
    accessToken: state.userInfo.accessToken,
  }
}

export default connect(mapStateToProps, null)(Issues);
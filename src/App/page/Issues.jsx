import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import SearchTool from '../components/SearchTool';
import LoadingView from '../components/LoadingView';
import { connect } from 'react-redux';
import axios from 'axios';

function Issues({ repositories, deactivatedRepos, accessToken }) {
  const [issueChartData, setIssueChartData] = useState({datasets: {}, labels: []})
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
              let month = current[current.state == "open" ? "createdAt" : "closedAt"].substr(0, 7)
                if (month in accumulator) {
                  accumulator[month][current.state == "open" ? 0 : 1] += 1
                } else {
                  accumulator[month] = current.state == "open" ? [1, 0] : [0, 1]
                  if (month > maxMonth) maxMonth = month
                  if (month < minMonth) minMonth = month
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
      .catch(err => {
        alert(err)
      })
  }

  useEffect(() => {
    const selectedRepostitory = repositories.find(repo => !deactivatedRepos.includes(repo))
    if(selectedRepostitory !== undefined) {
      setIsLoading(true)
      getIssuesClassifiedWithMonth(selectedRepostitory)
        .then( repo => {
          let months = Object.keys(repo.issues).sort().filter(month => month < "2021-06")
          let issues = months.map(month => repo.issues[month])
          setIssueChartData({
            labels: months,
            datasets: {
              open: issues.map(issue => issue[0]).map((sum => value => sum += value)(0)), 
              closed : issues.map(issue => issue[1]).map((sum => value => sum += value)(0)),
            },
            colors: {
              open: "#ff97ba",
              closed : "#009f4d",
            }
          })
          setIsLoading(false)
        })
    } else {
      setIssueChartData({
        labels: [],
        datasets: {}
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositories, deactivatedRepos])

  return (
    <div>
      <h2>Issues</h2>
      <LoadingView visible={isLoading}/>
      <SearchTool singleSelect={true}/>
      <LineChart datas={issueChartData} fill={true} cumulative={true}/>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    repositories: state.searchCondition.repositories,
    deactivatedRepos: state.searchCondition.deactivated,
    accessToken: state.userInfo.accessToken,
  }
}

export default connect(mapStateToProps, null)(Issues);
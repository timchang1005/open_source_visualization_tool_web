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
    const selectedRepostitory = repositories.find(repo => !deactivatedRepos.includes(repo))
    if(selectedRepostitory !== undefined) {
      setIsLoading(true)
      getIssuesClassifiedWithMonth(selectedRepostitory)
        .then( repo => {
          let months = Object.keys(repo.issues).sort()
          let issues = months.map(month => repo.issues[month])
          setIssueChartData({
            labels: months,
            datasets: {
              closed : issues.map(issue => issue[1]).map((sum => value => sum += value)(0)),
              created: issues.map(issue => issue[0]).map((sum => value => sum += value)(0)), 
            },
            colors: {
              closed : "#009f4d",
              created: "#ff97ba",
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
  }, [repositories, deactivatedRepos])

  return (
    <div>
      <h2>Issues</h2>
      <LoadingView visible={isLoading}/>
      <SearchTool singleSelect={true}/>
      <LineChart datas={issueChartData} fill={true}/>
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
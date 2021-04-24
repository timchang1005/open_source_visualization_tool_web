import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import SearchTool from '../components/SearchTool';
import LoadingView from '../components/LoadingView';
import { connect } from 'react-redux';
import axios from 'axios';

function PullRequests({ repositories, deactivatedRepos, accessToken }) {
  const [issueChartData, setIssueChartData] = useState({datasets: {}, labels: []})
  const [isLoading, setIsLoading] = useState(false)

  const getIssuesClassifiedWithMonth = (repo) => {
    const [repoOwner, repoName] = repo.split('/')
    return axios.post(`http://localhost:5000/api/v1/pulls`, {repoOwner, repoName, accessToken})
      .then(() => (
        axios.get(`http://localhost:5000/api/v1/pulls?repoOwner=${repoOwner}&repoName=${repoName}`)
          .then(({ data: pullRequests }) => {
            let minMonth = "9999-12"
            let maxMonth = "1970-01"
            let result = pullRequests.reduce((accumulator, current) => {
              let createdMonth = current.createdAt.substr(0, 7)
              if(createdMonth in accumulator) {
                accumulator[createdMonth][0] += 1
              } else {
                accumulator[createdMonth] = [1, 0, 0]
                if(createdMonth > maxMonth) maxMonth = createdMonth
                if(createdMonth < minMonth) minMonth = createdMonth
              }
              if (current.closedAt != null) {
                let closedMonth = current.closedAt.substr(0, 7)
                if(closedMonth in accumulator) {
                  accumulator[closedMonth][1] += 1
                  if (current.state === "merged") accumulator[closedMonth][2] += 1
                } else {
                  accumulator[closedMonth] = current.state == "closed" ? [0, 1, 0] : [0, 1, 1]
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
              pullRequests: result
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
          let months = Object.keys(repo.pullRequests).sort()
          let pullRequests = months.map(month => repo.pullRequests[month])
          setIssueChartData({
            labels: months,
            datasets: {
              merged : pullRequests.map(issue => issue[2]).map((sum => value => sum += value)(0)),
              closed : pullRequests.map(issue => issue[1]).map((sum => value => sum += value)(0)),
              created: pullRequests.map(issue => issue[0]).map((sum => value => sum += value)(0)), 
            },
            colors: {
              merged : "#fdbd10",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositories, deactivatedRepos])

  return (
    <div>
      <h2>Pull Requests</h2>
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

export default connect(mapStateToProps, null)(PullRequests);
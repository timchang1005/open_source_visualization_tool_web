import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import SearchTool from '../components/SearchTool';
import LoadingView from '../components/LoadingView';
import { connect } from 'react-redux';
import axios from 'axios';

function PullRequests({ repositories, deactivatedRepos, accessToken }) {
  const [pullRequestChartData, setPullRequestChartData] = useState({datasets: {}, labels: []})
  const [isLoading, setIsLoading] = useState(false)

  const getPullRequestsClassifiedWithMonth = (repo) => {
    const [repoOwner, repoName] = repo.split('/')
    return axios.post(`http://localhost:5000/api/v1/pulls`, {repoOwner, repoName, accessToken})
      .then(() => (
        axios.get(`http://localhost:5000/api/v1/pulls?repoOwner=${repoOwner}&repoName=${repoName}`)
          .then(({ data: pullRequests }) => {
            let minMonth = "9999-12"
            let maxMonth = "1970-01"
            let result = pullRequests.reduce((accumulator, current) => {
              let month = current[current.state == "open" ? "createdAt" : current.state == "merged" ? "mergedAt" : "closedAt"].substr(0, 7)
                if (month in accumulator) {
                  accumulator[month][current.state == "open" ? 0 : current.state == "closed" ? 1 : 2] += 1
                } else {
                  accumulator[month] = current.state == "open" ? [1, 0, 0] : current.state == "closed" ? [0, 1, 0] : [0, 0, 1]
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
      getPullRequestsClassifiedWithMonth(selectedRepostitory)
        .then( repo => {
          let months = Object.keys(repo.pullRequests).sort()
          let pullRequests = months.map(month => repo.pullRequests[month])
          setPullRequestChartData({
            labels: months,
            datasets: {
              created: pullRequests.map(pullRequest => pullRequest[0]).map((sum => value => sum += value)(0)), 
              closed : pullRequests.map(pullRequest => pullRequest[1]).map((sum => value => sum += value)(0)),
              merged : pullRequests.map(pullRequest => pullRequest[2]).map((sum => value => sum += value)(0)),
            },
            colors: {
              created: "#ff97ba",
              closed : "#009f4d",
              merged : "#fdbd10",
            }
          })
          setIsLoading(false)
        })
    } else {
      setPullRequestChartData({
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
      <LineChart datas={pullRequestChartData} fill={true} cumulative={true}/>
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
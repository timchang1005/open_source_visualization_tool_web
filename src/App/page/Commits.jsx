import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import SearchTool from '../components/SearchTool';
import LoadingView from '../components/LoadingView';
import { connect } from 'react-redux';
import axios from 'axios';

function Commits({ repositories, deactivatedRepos, accessToken }) {
  const [commitChartData, setCommitChartData] = useState({datasets: {}, labels: []})
  const [isLoading, setIsLoading] = useState(false)

  const getCommitsClassifiedWithMonth = (repo) => {
    const [repoOwner, repoName] = repo.split('/')
    return axios.post(`http://localhost:5000/api/v1/commits`, {repoOwner, repoName, accessToken})
      .then(() => (
        axios.get(`http://localhost:5000/api/v1/commits?repoOwner=${repoOwner}&repoName=${repoName}`)
          .then(({ data: commits }) => {
            let minMonth = "9999-12"
            let maxMonth = "1970-01"
            let result = commits.reduce((accumulator, current) => {
              let committedMonth = current.committedDate.substr(0, 7)
              if(committedMonth in accumulator) {
                accumulator[committedMonth] += 1
              } else {
                accumulator[committedMonth] = 1
                if(committedMonth > maxMonth) maxMonth = committedMonth
                if(committedMonth < minMonth) minMonth = committedMonth
              }
              return accumulator
            }, {})
            let tempMonth = new Date(...minMonth.split('-').map(str => parseInt(str)))
            while(tempMonth.toISOString().substr(0, 7) < maxMonth) {
              if(!(tempMonth.toISOString().substr(0, 7) in result)) {
                result[tempMonth.toISOString().substr(0, 7)] = 0
              }
              tempMonth.setMonth(tempMonth.getMonth() + 1)
            }
            return {
              name: repo,
              commits: result
            }
          })
      ))
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all(repositories.filter(repo => !deactivatedRepos.includes(repo)).map(repo => getCommitsClassifiedWithMonth(repo)))
      .then( repos => {
        let months = repos.reduce(( uniqueMonths, repo ) => {
          for (const month in repo.commits) {
            if(!uniqueMonths.includes(month)) {
              uniqueMonths.push(month)
            }
          }
          return uniqueMonths
        }, []).sort()

        setCommitChartData({
          labels: months,
          datasets: Object.fromEntries(repos.map(repo => (
            [repo.name, months.map(month => month in repo.commits ? repo.commits[month] : 0)]
          )))
        })

        setIsLoading(false)
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositories, deactivatedRepos])

  return (
    <div>
      <h2>Commits</h2>
      <LoadingView visible={isLoading}/>
      <SearchTool/>
      <LineChart datas={commitChartData}/>
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

export default connect(mapStateToProps, null)(Commits);
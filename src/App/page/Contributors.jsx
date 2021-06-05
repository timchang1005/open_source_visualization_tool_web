import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import SearchTool from '../components/SearchTool';
import LoadingView from '../components/LoadingView';
import { connect } from 'react-redux';
import axios from 'axios';

let colorChips = ["#84abd6", "#ff97ba", "#fdbd10", "#0066b2", "#ed7902", "#0085ad", "#009f4d", "#335238" ,"#c68143" ,"#ec1c24"]

function Commits({ repositories, deactivatedRepos, accessToken }) {
  const [commitChartData, setCommitChartData] = useState({datasets: {}, labels: []})
  const [isLoading, setIsLoading] = useState(false)
  const [maxContributor, setMaxContributor] = useState(5)

  const getCommitsClassifiedWithMonth = (repo) => {
    const [repoOwner, repoName] = repo.split('/')
    return axios.post(`http://localhost:5000/api/v1/commits`, {repoOwner, repoName, accessToken})
      .then(() => (
        axios.get(`http://localhost:5000/api/v1/commits?repoOwner=${repoOwner}&repoName=${repoName}`)
          .then(({ data: commits }) => {
            let minMonth = "9999-12"
            let maxMonth = "1970-01"
            let result = commits.reduce((accumulator, current) => {
              let committer = current.committer
              let committedMonth = current.committedDate.substr(0, 7)
              if (!(committer in accumulator))  accumulator[committer] = {}
              if (committedMonth in accumulator[committer]) {
                accumulator[committer][committedMonth] += 1
              } else {
                accumulator[committer][committedMonth] = 1
                if(committedMonth > maxMonth) maxMonth = committedMonth
                if(committedMonth < minMonth) minMonth = committedMonth
              }
              return accumulator
            }, {})
            let tempMonth = new Date(...minMonth.split('-').map(str => parseInt(str)))
            while(tempMonth.toISOString().substr(0, 7) < maxMonth) {
              for (const committer in result) {
                if(!(tempMonth.toISOString().substr(0, 7) in result[committer])) {
                  result[committer][tempMonth.toISOString().substr(0, 7)] = 0
                }
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
    const selectedRepostitory = repositories.find(repo => !deactivatedRepos.includes(repo))
    if(selectedRepostitory !== undefined) {
      setIsLoading(true)
      getCommitsClassifiedWithMonth(selectedRepostitory)
        .then( repo => {
          let months = []
          let totalCountOfCommitter = []
          Object.entries(repo.commits).forEach(([committer, commits], index) => {
            if (index === 0) {
              months = Object.keys(commits).sort().filter(month => month < "2021-06")
            }
            totalCountOfCommitter.push([committer, Object.values(commits).reduce((a, b) => a + b, 0)])
          })
          totalCountOfCommitter.sort((a, b) => b[1] - a[1])
          let nullCommitter = totalCountOfCommitter.find(([committer]) => committer === "null")
          if (nullCommitter) {
            totalCountOfCommitter = [...totalCountOfCommitter.filter(([committer]) => committer !== "null"), nullCommitter]
          }

          let datasets = {}
          totalCountOfCommitter.slice(0, maxContributor).forEach(([committer]) => {
            datasets[committer] = months.map(month => repo.commits[committer][month]).map((sum => value => sum += value)(0))
          })

          datasets['total'] = months.map((month) => 
            totalCountOfCommitter.map(([committer]) => 
              repo.commits[committer][month]
            ).reduce((a, b) => a + b, 0)
          ).map((sum => value => sum += value)(0))
          
          setCommitChartData({
            labels: months,
            datasets: datasets,
            colors: Object.fromEntries([
              ...totalCountOfCommitter.slice(0, maxContributor).map(([committer], index) => 
                [committer, colorChips[index]]
              ),
            ])
          })
          setIsLoading(false)
        })
        .catch(err => {
          alert(err)
        })
    } else {
      setCommitChartData({
        labels: [],
        datasets: {}
      })
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositories, deactivatedRepos])

  return (
    <div>
      <h2>Contributors</h2>
      <LoadingView visible={isLoading}/>
      <SearchTool singleSelect={true}/>
      <LineChart datas={commitChartData} fill={true} cumulative={true}/>
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
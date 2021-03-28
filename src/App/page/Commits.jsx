import React, { useEffect } from 'react';
import DrawingBoard from '../components/DrawingBoard';
import { connect } from 'react-redux';
import axios from 'axios';
import SearchTool from '../components/SearchTool'

function Commits({ repositories }) {

  const getCommitsClassifiedWithMonth = (repo) => {
    const [repoOwner, repoName] = repo.split('/')
    return axios.get(`http://localhost:5000/api/v1/commits?repoOwner=${repoOwner}&repoName=${repoName}`)
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
  }

  useEffect(() => {
    let chartDataset = { labels: [], datas: {}}
    Promise.all(repositories.map(repo => getCommitsClassifiedWithMonth(repo)))
      .then( repoCommits => {
        let months = repoCommits.reduce(( uniqueMonths, repo ) => {
          for (const month in repo.commits) {
            if(!uniqueMonths.includes(month)) {
              uniqueMonths.push(month)
            }
          }
          return uniqueMonths
        }, []).sort()

        chartDataset.labels = months
        chartDataset.datas = Object.fromEntries(repoCommits.map(repo => (
          [repo.name, months.map(month => month in repo.commits ? repo.commits[month] : 0)]
        )))
        console.log(chartDataset)
      })
  }, [repositories])

  return (
    <div>
      <SearchTool/>
      <DrawingBoard/>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    repositories: state.searchCondition.repositories
  }
}

export default connect(mapStateToProps, null)(Commits);
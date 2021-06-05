import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import SearchTool from '../components/SearchTool';
import LoadingView from '../components/LoadingView';
import { connect } from 'react-redux';
import axios from 'axios';

function Releases({ repositories, deactivatedRepos, accessToken }) {
  const [tagChartData, setTagChartData] = useState({datasets: {}, labels: []})
  const [isLoading, setIsLoading] = useState(false)

  const getTagsClassifiedWithMonth = (repo) => {
    const [repoOwner, repoName] = repo.split('/')
    return axios.post(`http://localhost:5000/api/v1/tags`, {repoOwner, repoName, accessToken})
      .then(() => (
        axios.get(`http://localhost:5000/api/v1/tags?repoOwner=${repoOwner}&repoName=${repoName}`)
          .then(({ data: tags }) => {
            let minMonth = "9999-12"
            let maxMonth = "1970-01"
            let result = tags.reduce((accumulator, current) => {
              let createdMonth = current.createdAt.substr(0, 7)
              if(createdMonth in accumulator) {
                accumulator[createdMonth] += 1
              } else {
                accumulator[createdMonth] = 1
                if(createdMonth > maxMonth) maxMonth = createdMonth
                if(createdMonth < minMonth) minMonth = createdMonth
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
              tags: result
            }
          })
      ))
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all(repositories.filter(repo => !deactivatedRepos.includes(repo)).map(repo => getTagsClassifiedWithMonth(repo)))
      .then( repos => {
        let months = repos.reduce(( uniqueMonths, repo ) => {
          for (const month in repo.tags) {
            if(!uniqueMonths.includes(month)) {
              uniqueMonths.push(month)
            }
          }
          return uniqueMonths
        }, []).sort().filter(month => month < "2021-06")

        setTagChartData({
          labels: months,
          datasets: Object.fromEntries(repos.map(repo => (
            [repo.name, months.map(month => month in repo.tags ? repo.tags[month] : 0)]
          )))
        })

        setIsLoading(false)
      })
      .catch(err => {
        alert(err)
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositories, deactivatedRepos])

  return (
    <div>
      <h2>Releases</h2>
      <LoadingView visible={isLoading}/>
      <SearchTool/>
      <LineChart datas={tagChartData}/>
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

export default connect(mapStateToProps, null)(Releases);
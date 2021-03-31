let colorChips =["#84abd6", "#ff97ba", "#fdbd10", "#0066b2", "#ed7902", "#0085ad", "#009f4d", "#335238" ,"#c68143" ,"#ec1c24"]

const RepoColor = (state = {}, action) => {
  switch(action.type) {
    case "ADD_REPOSITORY": {
      return Object.fromEntries(
        [...Object.keys(state), action.payload.repository].map((repoName, repoIndex) => (
          [repoName, colorChips[repoIndex]]
        ))
      )
    }
    case "REMOVE_REPOSITORY": {
      return Object.fromEntries(
        Object.keys(state).filter(repoName => repoName !== action.payload.repository)
          .map((repoName, repoIndex) => (
            [repoName, colorChips[repoIndex]]
          ))
      )
    }
    default: 
      return state
  }
}

export default RepoColor;
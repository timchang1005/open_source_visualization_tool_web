const initState = {
  repositories: [],
  sinceTime: null,
  beforeTime: null
}

const SearchCondition = (state = initState, action) => {
  switch(action.type) {
    case "ADD_REPOSITORY": {
      return state.repositories.includes(action.payload.repository) ? 
        state :
        { ...state, repositories: [...state.repositories, action.payload.repository] }
    }
    case "REMOVE_REPOSITORY": {
      return {
        ...state,
        repositories: state.repositories.filter(repo => repo !== action.payload.repository)
      }
    }
    default:
      return state
  }
}

export default SearchCondition;
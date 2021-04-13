const initState = {
  repositories: [],
  deactivated: [],
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
    case "ACTIVATE_REPOSITORY": {
      return { ...state, deactivated: state.deactivated.filter(repo => repo !== action.payload.repository)}
    }
    case "DEACTIVATE_REPOSITORY": {
      return { ...state, deactivated: [...state.deactivated, action.payload.repository] }
    }
    case "REMOVE_REPOSITORY": {
      return {
        ...state,
        repositories: state.repositories.filter(repo => repo !== action.payload.repository),
        deactivated: state.deactivated.filter(repo => repo != action.payload.repository)
      }
    }
    default:
      return state
  }
}

export default SearchCondition;
import { combineReducers } from 'redux';
import githubAccountInfoReducer from './GithubAccountInfo'

const rootReducer = combineReducers({
  githubAccountInfo: githubAccountInfoReducer
})

export default rootReducer;
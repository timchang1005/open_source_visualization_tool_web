import { combineReducers } from 'redux';
import UserInfo from './UserInfo'
import SearchCondition from './SearchCondition'
import RepoColor from './RepoColor'

const rootReducer = combineReducers({
  userInfo: UserInfo,
  searchCondition: SearchCondition,
  repoColor: RepoColor
})

export default rootReducer;
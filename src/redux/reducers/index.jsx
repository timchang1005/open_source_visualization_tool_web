import { combineReducers } from 'redux';
import UserInfo from './UserInfo'
import SearchCondition from './SearchCondition'

const rootReducer = combineReducers({
  userInfo: UserInfo,
  searchCondition: SearchCondition
})

export default rootReducer;
import { combineReducers } from 'redux'
import testReducer from './testSlice'

export default combineReducers({
  test: testReducer
})

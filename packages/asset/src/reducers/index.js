import { combineReducers } from 'redux'
import testReducer from './testSlice'
import addressReducer from './addressSlice'
import assetReducer from './assetSlice'

export default combineReducers({
  test: testReducer,
  address: addressReducer,
  assets: assetReducer
})

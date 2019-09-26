import { combineReducers } from 'redux'
import testReducer from './testSlice'
import addressReducer from './addressSlice'
import assetReducer from './assetSlice'
import settingsReducer from './settingsSlice'
import intentionReducer from './intentionSlice'

export default combineReducers({
  test: testReducer,
  address: addressReducer,
  assets: assetReducer,
  settings: settingsReducer,
  intentions: intentionReducer
})

import { combineReducers } from 'redux'
import testReducer from './testSlice'
import addressReducer from './addressSlice'
import assetReducer from './assetSlice'
import settingsReducer from './settingsSlice'
import intentionReducer from './intentionSlice'
import chainReducer from './chainSlice'
import trustReducer from './trustSlice'
import nodeReducer from './nodeSlice'
import transactionReducer from './transactionSlice'
import snackReducer from './snackSlice'

export default combineReducers({
  test: testReducer,
  address: addressReducer,
  assets: assetReducer,
  settings: settingsReducer,
  intentions: intentionReducer,
  chain: chainReducer,
  trust: trustReducer,
  node: nodeReducer,
  transaction: transactionReducer,
  snack: snackReducer
})

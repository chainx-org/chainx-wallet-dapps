import { createSlice } from '@reduxjs/toolkit'
import { getChainxPromised } from '../services/chainx'

const tradeSlice = createSlice({
  name: 'dex',
  initialState: {
    pairs: [],
    currentPair: null
  },
  reducers: {
    setPairs: (state, action) => {
      state.pairs = action.payload
    },
    setCurrentPair: (state, action) => {
      state.currentPair = action.payload
    }
  }
})

export const { setPairs, setCurrentPair } = tradeSlice.actions

export const fetchDexPairs = () => async dispatch => {
  const api = await getChainxPromised()
  const pairs = await api.rpc.xspot.getTradingPairs()

  const json = pairs.toJSON()
  dispatch(setPairs(json))
  dispatch(setCurrentPair(json[0]))
}

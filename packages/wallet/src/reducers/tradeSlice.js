import { createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'
import { getApi } from '../services/api'

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    pairs: [],
    currentPair: null,
    fills: {}
  },
  reducers: {
    setPairs: (state, action) => {
      state.pairs = action.payload
    },
    setCurrentPair: (state, action) => {
      state.currentPair = action.payload
    },
    setFills: (state, { payload: { pairId, fills } }) => {
      state.fills[pairId] = fills
    }
  }
})

export const { setPairs, setCurrentPair, setFills } = tradeSlice.actions

export const fetchTradePairs = () => async dispatch => {
  const chainx = getChainx()
  await chainx.isRpcReady()
  const { trade } = chainx

  const pairs = await trade.getTradingPairs()
  dispatch(setPairs(pairs))
  dispatch(setCurrentPair(pairs[0]))
}

export const fetchFills = (pairId, count = 20) => async dispatch => {
  const resp = await window.fetch(
    `${getApi()}trade/latestfills/${pairId}?count=${count}`
  )

  const data = await resp.json()
  dispatch(setFills({ pairId, fills: data }))
}

export const pairsSelector = state => state.trade.pairs
export const currentPairSelector = state => state.trade.currentPair
export const fillsSelector = state => state.trade.fills

export default tradeSlice.reducer

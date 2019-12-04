import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'
import { getApi } from '../services/api'

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    pairs: [],
    currentPair: null,
    fills: {},
    quotations: {
      asks: [],
      bids: []
    }
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
    },
    setQuotations: (state, { payload }) => {
      state.quotations = payload
    }
  }
})

export const {
  setPairs,
  setCurrentPair,
  setFills,
  setQuotations
} = tradeSlice.actions

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

export const fetchQuotations = (pairId, count = 50) => async dispatch => {
  const resp = await window.fetch(
    `${getApi()}trade/handicap/${pairId}?count=${count}`
  )
  const data = await resp.json()
  dispatch(setQuotations(data))
}

export const pairsSelector = state => state.trade.pairs
export const currentPairSelector = state => state.trade.currentPair
export const currentPairIdSelector = createSelector(
  currentPairSelector,
  pair => {
    if (!pair) {
      return null
    }

    return pair.id
  }
)

export const fillsSelector = state => state.trade.fills
export const asksSelector = state => state.trade.quotations.asks
export const bidsSelector = state => state.trade.quotations.bids

export default tradeSlice.reducer

import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainxPromised } from '../services/chainx'
import { getApi } from '../services/api'
import { remove0xPrefix } from '../utils'

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    pairs: [],
    currentPair: null,
    fills: {},
    quotations: {
      asks: [],
      bids: []
    },
    nowOrders: [],
    historyOrders: []
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
    },
    setNowOrders: (state, { payload }) => {
      state.nowOrders = payload
    },
    setHistoryOrders: (state, { payload }) => {
      state.historyOrders = payload
    }
  }
})

export const {
  setPairs,
  setCurrentPair,
  setFills,
  setQuotations,
  setNowOrders,
  setHistoryOrders
} = tradeSlice.actions

export const fetchTradePairs = () => async dispatch => {
  const api = await getChainxPromised()

  const pairs = await api.rpc.xspot.getTradingPairs()
  console.log('pairs', pairs)
  // await chainx.isRpcReady()
  // const { trade } = chainx
  //
  // const pairs = await trade.getTradingPairs()
  // dispatch(setPairs(pairs))
  // dispatch(setCurrentPair(pairs[0]))
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

export const fetchNowOrders = accountId => async dispatch => {
  const resp = await window.fetch(
    `${getApi()}trade/userorders/${remove0xPrefix(accountId)}?status=0`
  )

  const data = await resp.json()
  dispatch(setNowOrders(data.items))
}

export const fetchHistoryOrders = accountId => async dispatch => {
  const resp = await window.fetch(
    `${getApi()}trade/userorders/${remove0xPrefix(accountId)}?status=3`
  )

  const data = await resp.json()
  dispatch(setHistoryOrders(data.items))
}

export const pairsSelector = state => state.trade.pairs
export const currentPairSelector = state => state.trade.currentPair
export let currentPairIdSelector = createSelector(currentPairSelector, pair => {
  if (!pair) {
    return null
  }

  return pair.id
})

export const fillsSelector = state => state.trade.fills
export const asksSelector = state => state.trade.quotations.asks
export const bidsSelector = state => state.trade.quotations.bids
export const userOrders = state => state.trade.nowOrders
export const historyOrdersSelector = state => state.trade.historyOrders

export default tradeSlice.reducer

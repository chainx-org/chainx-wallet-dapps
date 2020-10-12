import { createSlice } from '@reduxjs/toolkit'
import { mainNetApiV2 } from '../services/api'

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

export const fetchFills = pairId => async dispatch => {
  // https://api-v2.chainx.org/dex/fills/0
  const resp = await window.fetch(`${mainNetApiV2}dex/fills/${pairId}`)
  const data = await resp.json()
  // console.log('fills', data)
  dispatch(setFills({ pairId, fills: data.items }))
}

export const fetchQuotations = (pairId, count = 50) => async dispatch => {
  // https://api-v2.chainx.org/dex/handicap/0
  const resp = await window.fetch(`${mainNetApiV2}dex/depth/${pairId}`)
  const data = await resp.json()
  // console.log('quotations', data)
  dispatch(setQuotations(data))
}

export const fetchNowOrders = pairId => async dispatch => {
  const resp = await window.fetch(`${mainNetApiV2}dex/open_orders/${pairId}`)

  const data = await resp.json()
  dispatch(setNowOrders(data.items))
}

export const fetchHistoryOrders = (accountId, pairId = 0) => async dispatch => {
  //  废弃
  // const resp = await window.fetch(
  //   `${mainNetApiV2}dex/${accountId}/account_orders/${pairId}`
  // )
  const resp = await window.fetch(
    `${mainNetApiV2}dex/fills/${pairId}?page=0&page_size=20`
  )
  const data = await resp.json()
  // console.log('historys', data.items)
  dispatch(setHistoryOrders(data.items.filter(val => val.maker === accountId)))
}

export const fillsSelector = state => state.trade.fills
export const asksSelector = state =>
  state.trade.quotations ? state.trade.quotations.asks : []
export const bidsSelector = state =>
  state.trade.quotations ? state.trade.quotations.bids : []
export const userOrders = state => state.trade.nowOrders
export const historyOrdersSelector = state => state.trade.historyOrders

export default tradeSlice.reducer

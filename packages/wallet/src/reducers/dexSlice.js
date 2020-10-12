import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainxPromised } from '../services/chainx'

const dexSlice = createSlice({
  name: 'dex',
  initialState: {
    pairs: [],
    currentPair: null,
    depth: {
      asks: [],
      bids: []
    },
    orders: {
      pageIndex: 0,
      pageSize: 0,
      data: []
    }
  },
  reducers: {
    setPairs: (state, action) => {
      state.pairs = action.payload
    },
    setCurrentPair: (state, action) => {
      state.currentPair = action.payload
    },
    setDepth: (state, { payload }) => {
      state.depth = payload
    },
    setOrders: (state, { payload }) => {
      state.orders = payload
    }
  }
})

export const {
  setPairs,
  setCurrentPair,
  setDepth,
  setOrders
} = dexSlice.actions

export const getAccountOrders = address => async dispatch => {
  const api = await getChainxPromised()
  const orders = await api.rpc.xspot.getOrdersByAccount(address, 0, 100)
  // console.log('getAccountOrders', orders.toJSON())
  dispatch(setOrders(orders.toJSON()))
}

export const fetchDexPairs = () => async dispatch => {
  const api = await getChainxPromised()
  const pairs = await api.rpc.xspot.getTradingPairs()
  const json = pairs.toJSON()
  dispatch(setPairs(json))
  dispatch(setCurrentPair(json[0]))
}

export const fetchDexDepth = () => async dispatch => {
  const api = await getChainxPromised()
  const depth = await api.rpc.xspot.getDepth(0, 10)

  dispatch(setDepth(depth.toJSON()))
}

// baseCurrency: 0
// highestBid: 64900
// id: 0
// latestPrice: 65000
// latestPriceUpdatedAt: 0
// lowestAsk: 65000
// maxValidBid: 75000
// minValidAsk: 54900
// pipDecimals: 9
// quoteCurrency: 1
// tickDecimals: 2
// tradable: true

export const currentPairSelector = state => state.dex.currentPair
export const currentPairIdSelector = createSelector(
  currentPairSelector,
  pair => pair?.id
)
export const latestPriceSelector = createSelector(currentPairSelector, pair => {
  if (!pair) {
    return 0
  }

  return pair.latestPrice
})
export const pricePrecisionSelector = createSelector(
  currentPairSelector,
  pair => {
    if (!pair) {
      return 0
    }

    return pair.pipDecimals - pair.tickDecimals
  }
)
export const maxBuyShowPriceSelector = createSelector(
  currentPairSelector,
  pair => {
    if (!pair) {
      return 0
    }

    return pair.maxValidBid
  }
)
export const minSellPriceSelector = createSelector(
  currentPairSelector,
  pair => {
    if (!pair) {
      return 0
    }

    return pair.minValidAsk
  }
)

export const maxBuyPriceSelector = createSelector(currentPairSelector, pair => {
  if (!pair) {
    return 0
  }

  return pair.maxValidBid
})

export const ordersSelector = state => state.dex.orders

export default dexSlice.reducer

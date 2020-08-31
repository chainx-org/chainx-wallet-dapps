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
    }
  }
})

export const { setPairs, setCurrentPair, setDepth } = dexSlice.actions

export const getAccountOrders = address => async dispatch => {
  const api = await getChainxPromised()
  const orders = await api.rpc.xspot.getOrdersByAccount(address, 0, 100)
  console.log('orders', orders.toJSON())
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

export default dexSlice.reducer

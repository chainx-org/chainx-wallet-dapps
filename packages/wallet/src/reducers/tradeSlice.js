import { createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    pairs: []
  },
  reducers: {
    setPairs: (state, action) => {
      state.pairs = action.payload
    }
  }
})

const { setPairs } = tradeSlice.actions

export const fetchTradePairs = () => async dispatch => {
  const chainx = getChainx()
  await chainx.isRpcReady()
  const { trade } = chainx

  const pairs = await trade.getTradingPairs()
  dispatch(setPairs(pairs))
}

export const pairsSelector = state => state.trade.pairs

export default tradeSlice.reducer

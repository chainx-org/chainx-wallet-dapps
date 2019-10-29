import { createSlice } from 'redux-starter-kit'
import { remove0xPrefix } from '../utils'

const crossChainSlice = createSlice({
  slice: 'asset',
  initialState: {
    deposits: [],
    withdrawals: []
  },
  reducers: {
    setDeposits: {
      reducer(state, action) {
        state.deposits = action.payload
      }
    },
    setWithdrawals: {
      reducer(state, action) {
        state.withdrawals = action.payload
      }
    }
  }
})

export const depositsSelector = state => state.crossChain.deposits

export const fetchDeposits = accountId => async dispatch => {
  const resp = await window.fetch(
    `https://api.chainx.org/account/${remove0xPrefix(
      accountId
    )}/deposits?chain=1&&token=BTC&page=0&page_size=100`
  )
  const { items } = await resp.json()
  dispatch(setDeposits(items))
}

export const { setDeposits, setWithdrawals } = crossChainSlice.actions

export default crossChainSlice.reducer

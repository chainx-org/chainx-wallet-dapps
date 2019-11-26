import { createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'

const xrcbtcSlice = createSlice({
  name: 'xrcbtc',
  initialState: {
    info: null,
    balance: 0
  },
  reducers: {
    setBalance: {
      reducer(state, action) {
        state.balance = action.payload
      }
    },
    setInfo: {
      reducer(state, action) {
        state.info = action.payload
      }
    }
  }
})

export const { setBalance, setInfo } = xrcbtcSlice.actions

export const fetchXrcBtcBalance = accountId => async dispatch => {
  const chainx = getChainx()

  const { data, status } = await chainx.api.rpc.chainx.contractXRC20Call({
    token: 'BTC',
    selector: 'BalanceOf',
    inputData: accountId
  })

  if (status === 0) {
    dispatch(setBalance(data))
  }
}

export const fetchXrcBtcInfo = () => async dispatch => {
  const chainx = getChainx()

  const info = await chainx.api.rpc.chainx.contractXRCTokenInfo()
  dispatch(setInfo(info))
}

export const xrcBtcBalanceSelector = state => state.xrcbtc.balance
export const xrcBtcXrc20InfoSelector = state =>
  state.xrcbtc.info && state.xrcbtc.info.BTC.XRC20

export default xrcbtcSlice.reducer

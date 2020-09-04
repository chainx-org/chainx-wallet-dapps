import { createSlice } from '@reduxjs/toolkit'
import { getChainx, getChainxPromised } from '../services/chainx'
import { getApi } from '../services/api'

const bitcoin = 'Bitcoin'

const trustSlice = createSlice({
  name: 'trust',
  initialState: {
    withdrawals: [],
    trusteeSessionInfo: null,
    btcWithdrawLimit: null
  },
  reducers: {
    setWithdrawals: {
      reducer(state, action) {
        state.withdrawals = action.payload
      }
    },
    setTrusteeSessionInfo: {
      reducer(state, action) {
        state.trusteeSessionInfo = action.payload
      }
    },
    setBtcWithdrawLimit: {
      reducer(state, action) {
        state.btcWithdrawLimit = action.payload
      }
    }
  }
})

export const btcWithdrawLimitSelector = state => state.trust.btcWithdrawLimit

export const hotAddressSelector = state =>
  state.trust.trusteeSessionInfo?.hotAddress.addr
export const withdrawalsSelector = state => state.trust.withdrawals

const {
  setWithdrawals,
  setTrusteeSessionInfo,
  setBtcWithdrawLimit
} = trustSlice.actions

export const fetchWithdrawals = () => async dispatch => {
  const { asset } = await getChainx()
  const { data } = await asset.getWithdrawalList(bitcoin, 0, 1000)
  data.sort((a, b) => b.height - a.height)
  const blockIds = data.map(d => d.height)
  const resp = await window.fetch(`${getApi()}blocksInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ids: blockIds })
  })
  const blocks = await resp.json()
  const normalized = data.map(d => {
    const block = blocks.find(b => b.number === d.height)
    return {
      ...d,
      time: block ? block.time : null
    }
  })
  dispatch(setWithdrawals(normalized))
}

export const fetchTrusteeSessionInfo = () => async dispatch => {
  const api = await getChainxPromised()
  const info = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo()

  dispatch(setTrusteeSessionInfo(info.toJSON()))
}

export const fetchBtcWithdrawLimit = () => async dispatch => {
  const { asset } = await getChainx()
  const resp = await asset.getWithdrawalLimitByToken('BTC')

  dispatch(setBtcWithdrawLimit(resp))
}

export default trustSlice.reducer

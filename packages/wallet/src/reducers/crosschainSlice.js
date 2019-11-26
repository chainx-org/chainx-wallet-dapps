import { createSlice } from '@reduxjs/toolkit'
import { remove0xPrefix } from '../utils'
import { getApi } from '../services/api'

const crossChainSlice = createSlice({
  name: 'asset',
  initialState: {
    deposits: [],
    withdrawals: [],
    locks: []
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
    },
    setLocks: {
      reducer(state, action) {
        state.locks = action.payload
      }
    }
  }
})

export const depositsSelector = state => state.crossChain.deposits
export const withdrawalsSelector = state => state.crossChain.withdrawals
export const locksSelector = state => state.crossChain.locks

export const fetchDeposits = accountId => async dispatch => {
  const resp = await window.fetch(
    `${getApi()}account/${remove0xPrefix(
      accountId
    )}/deposits?chain=1&&token=BTC&page=0&page_size=100`
  )
  const { items } = await resp.json()
  dispatch(setDeposits(items))
}

export const fetchWithdrawals = accountId => async dispatch => {
  const resp = await window.fetch(
    `${getApi()}account/${remove0xPrefix(
      accountId
    )}/withdrawals?chain=1&&token=BTC&page=0&page_size=100`
  )
  const { items } = await resp.json()
  dispatch(setWithdrawals(items))
}

export const fetchLocks = accountId => async dispatch => {
  const resp = await window.fetch(
    `${getApi()}btc/lock/records?accountid=${remove0xPrefix(
      accountId
    )}&page=0&page_size=100`
  )
  const { items } = await resp.json()
  dispatch(setLocks(items))
}

export const { setDeposits, setWithdrawals, setLocks } = crossChainSlice.actions

export default crossChainSlice.reducer

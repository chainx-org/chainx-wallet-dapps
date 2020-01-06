import { createSlice } from '@reduxjs/toolkit'
import { getApi } from '../services/api'
import { remove0xPrefix } from '../utils'
import { setLoading } from './runStatusSlice'

const pageSize = 10

const historyTxSlice = createSlice({
  name: 'historyTx',
  initialState: {
    items: [],
    page: null,
    pageSize: null,
    total: null
  },
  reducers: {
    setHistoryTxs(
      state,
      {
        payload: { items, page, pageSize, total }
      }
    ) {
      state.items = items
      state.page = page
      state.pageSize = pageSize
      state.total = total
    }
  }
})

export const fetchHistoryTxs = (accountId, page) => async dispatch => {
  dispatch(setLoading(true))
  try {
    const resp = await window.fetch(
      `${getApi()}account/${remove0xPrefix(
        accountId
      )}/txs?page_size=${pageSize}&&page=${page}&include_payee=true`
    )

    const data = await resp.json()
    dispatch(setHistoryTxs(data))
  } finally {
    dispatch(setLoading(false))
  }
}

export const { setHistoryTxs } = historyTxSlice.actions

export const historyTxsSelector = state => state.historyTxs.items
export const historyPageSelector = state => state.historyTxs.page
export const historyPageSizeSelector = state => state.historyTxs.pageSize
export const historyTotalSelector = state => state.historyTxs.total

export default historyTxSlice.reducer

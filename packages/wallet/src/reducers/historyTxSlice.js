import { createSlice } from '@reduxjs/toolkit'
import { getApi } from '../services/api'
import { remove0xPrefix } from '../utils'

const pageSize = 20

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
  const resp = await window.fetch(
    `${getApi()}account/${remove0xPrefix(
      accountId
    )}/txs?page_size=${pageSize}&&page=${page}&include_payee=true`
  )

  const data = await resp.json()
  console.log(data)

  dispatch(setHistoryTxs(data))
}

export const { setHistoryTxs } = historyTxSlice.actions

export const historyTxsSelector = state => state.historyTxs.items

export default historyTxSlice.reducer

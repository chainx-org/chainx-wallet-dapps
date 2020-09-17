import { createSlice } from '@reduxjs/toolkit'
import { getApi } from '../services/api'
import { Account } from '@chainx-v2/account'
import { useSelector } from 'react-redux'
import { accountSelector } from './addressSlice'

const transactionSlice = createSlice({
  name: 'asset',
  initialState: {
    scrollTransfers: {
      items: []
    }
  },
  reducers: {
    setScrollTransfers: {
      reducer(state, action) {
        state.scrollTransfers = action.payload
      }
    },
    appendScrollTransfers: {
      reducer(state, action) {
        state.scrollTransfers.items.push(...action.payload.items)
        state.scrollTransfers.page = action.payload.page
        state.scrollTransfers.total = action.payload.total
      }
    }
  }
})

export const scrollTransfersSelector = state =>
  state.transaction.scrollTransfers

export const {
  setScrollTransfers,
  appendScrollTransfers
} = transactionSlice.actions

export const fetchTransfers = (address, page = 0) => async dispatch => {
  const resp = await window.fetch(
    `${getApi()}accounts/${address}/transfers?page=${page}`
  )
  const data = await resp.json()
  if (!page || page <= 0) {
    dispatch(setScrollTransfers(data))
  } else {
    dispatch(appendScrollTransfers(data))
  }
}

export default transactionSlice.reducer

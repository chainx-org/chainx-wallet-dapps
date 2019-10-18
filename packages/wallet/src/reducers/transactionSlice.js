import { createSlice } from 'redux-starter-kit'

const transactionSlice = createSlice({
  slice: 'asset',
  initialState: {
    scrollTransfers: {
      items: [],
      loaded: false
    }
  },
  reducers: {
    setScrollTransfers: {
      reducer(state, action) {
        state.scrollTransfers = action.payload
        state.scrollTransfers.loaded = true
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

export const loadedSelector = state => state.transaction.scrollTransfers.loaded
export const scrollTransfersSelector = state =>
  state.transaction.scrollTransfers

export const {
  setScrollTransfers,
  appendScrollTransfers
} = transactionSlice.actions

export const fetchTransfers = (accountId, page = 0) => async dispatch => {
  const resp = await window.fetch(
    `https://api.chainx.org/account/${accountId}/transfers?page=${page}`
  )
  const data = await resp.json()
  if (!page || page <= 0) {
    dispatch(setScrollTransfers(data))
  } else {
    dispatch(appendScrollTransfers(data))
  }
}

export default transactionSlice.reducer

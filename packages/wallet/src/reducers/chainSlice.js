import { createSlice } from '@reduxjs/toolkit'

const chainSlice = createSlice({
  name: 'chain',
  initialState: {
    head: null
  },
  reducers: {
    setHead: {
      reducer(state, action) {
        state.head = action.payload
      }
    }
  }
})

export const headSelector = state => state.chain.head

export const blockNumberSelector = state =>
  state.chain.head ? state.chain.head.number : null

export const { setHead } = chainSlice.actions

export default chainSlice.reducer

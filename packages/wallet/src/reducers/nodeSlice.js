import { createSlice } from '@reduxjs/toolkit'

const nodeSlice = createSlice({
  name: 'node',
  initialState: {
    name: 'staging-1',
    url: 'wss://staging-1.chainx.org'
  },
  reducers: {
    setNode(state, action) {
      state.name = action.payload.name
      state.url = action.payload.url
    }
  }
})

export const { setNode } = nodeSlice.actions
export const urlSelector = state => state.node.url

export default nodeSlice.reducer

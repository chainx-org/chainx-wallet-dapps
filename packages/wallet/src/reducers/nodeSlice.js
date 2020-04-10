import { createSlice } from '@reduxjs/toolkit'

const nodeSlice = createSlice({
  name: 'node',
  initialState: {
    name: 'w2.org',
    url: 'wss://w2.chainx.org/ws'
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

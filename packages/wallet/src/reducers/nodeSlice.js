import { createSlice } from '@reduxjs/toolkit'

const nodeSlice = createSlice({
  name: 'node',
  initialState: {
    name: '47.114.131.193',
    url: 'ws://47.114.131.193:9000'
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

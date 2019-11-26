import { createSlice } from '@reduxjs/toolkit'

const nodeSlice = createSlice({
  name: 'node',
  initialState: {
    name: 'w1.org',
    url: 'wss://w1.chainx.org.cn/ws'
  },
  reducers: {
    setNode: {
      reducer(state, action) {
        state.name = action.payload.name
        state.url = action.payload.url
      }
    }
  }
})

export const { setNode } = nodeSlice.actions

export default nodeSlice.reducer

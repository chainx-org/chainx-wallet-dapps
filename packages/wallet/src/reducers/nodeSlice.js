import { createSlice } from '@reduxjs/toolkit'
import { defaultMainNetNode } from '../store'

const nodeSlice = createSlice({
  name: 'node',
  initialState: {
    name: defaultMainNetNode.name,
    url: defaultMainNetNode.url
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

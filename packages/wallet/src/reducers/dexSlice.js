import { createSlice } from '@reduxjs/toolkit'
import { getChainxPromised } from '../services/chainx'

const dexSlice = createSlice({
  name: 'dex',
  initialState: {
    pairs: [],
    currentPair: null
  },
  reducers: {
    setPairs: (state, action) => {
      state.pairs = action.payload
    },
    setCurrentPair: (state, action) => {
      state.currentPair = action.payload
    }
  }
})

export const { setPairs, setCurrentPair } = dexSlice.actions

export const fetchDexPairs = () => async dispatch => {
  const api = await getChainxPromised()
  const pairs = await api.rpc.xspot.getTradingPairs()

  const json = pairs.toJSON()
  dispatch(setPairs(json))
  dispatch(setCurrentPair(json[0]))
}

export const fetchDexDepth = () => async dispatch => {
  const api = await getChainxPromised()
  const depth = await api.rpc.xspot.getDepth(0, 10)

  console.log('depth', depth.toJSON())
}

export default dexSlice.reducer

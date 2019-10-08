import { createSlice } from 'redux-starter-kit'
import chainx from '../services/chainx'

const intentionSlice = createSlice({
  slice: 'intentions',
  initialState: {
    intentions: [],
    pseduIntentions: []
  },
  reducers: {
    setIntentions: {
      reducer(state, action) {
        state.intentions = action.payload
      }
    },
    setPseduIntentions: {
      reducer(state, action) {
        state.pseduIntentions = action.payload
      }
    }
  }
})

export const { setIntentions, setPseduIntentions } = intentionSlice.actions

export const fetchIntentions = () => async dispatch => {
  await chainx.isRpcReady()
  const { stake } = chainx

  const resp = await stake.getIntentions()
  dispatch(setIntentions(resp))
}

export const fetchPseduIntentions = () => async dispatch => {
  await chainx.isRpcReady()
  const { stake } = chainx

  const resp = await stake.getPseduIntentionsV1()
  dispatch(setPseduIntentions(resp))
}

export default intentionSlice.reducer

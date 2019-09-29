import { createSlice } from 'redux-starter-kit'
import chainx from '../services/chainx'

const intentionSlice = createSlice({
  slice: 'intentions',
  initialState: {
    intentions: []
  },
  reducers: {
    setIntentions: {
      reducer(state, action) {
        state.intentions = action.payload
      }
    }
  }
})

export const { setIntentions } = intentionSlice.actions

export const fetchIntentions = () => async dispatch => {
  await chainx.isRpcReady()
  const { stake } = chainx

  const resp = await stake.getIntentions()
  dispatch(setIntentions(resp))
}

export default intentionSlice.reducer

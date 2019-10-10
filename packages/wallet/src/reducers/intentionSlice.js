import { createSlice } from 'redux-starter-kit'
import chainx from '../services/chainx'

const intentionSlice = createSlice({
  slice: 'intentions',
  initialState: {
    intentions: [],
    pseduIntentions: [],
    pseduNominationRecords: []
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
    },
    setPseduNominationRecords: {
      reducer(state, action) {
        state.pseduNominationRecords = action.payload
      }
    }
  }
})

export const {
  setIntentions,
  setPseduIntentions,
  setPseduNominationRecords
} = intentionSlice.actions

async function getStake() {
  await chainx.isRpcReady()
  const { stake } = chainx

  return stake
}

export const fetchIntentions = () => async dispatch => {
  const stake = await getStake()

  const resp = await stake.getIntentions()
  dispatch(setIntentions(resp))
}

export const fetchPseduIntentions = () => async dispatch => {
  const stake = await getStake()

  const resp = await stake.getPseduIntentionsV1()
  dispatch(setPseduIntentions(resp))
}

export const fetchPseduNominationRecords = address => async dispatch => {
  const stake = await getStake()

  const resp = await stake.getPseduNominationRecordsV1(address)
  dispatch(setPseduNominationRecords(resp))
}

export const intentionsSelector = state => {
  return state.intentions.intentions
}

export default intentionSlice.reducer

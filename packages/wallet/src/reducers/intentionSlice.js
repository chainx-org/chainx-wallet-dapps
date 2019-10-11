import { createSlice, createSelector } from 'redux-starter-kit'
import chainx from '../services/chainx'

const intentionSlice = createSlice({
  slice: 'intentions',
  initialState: {
    intentions: [],
    pseduIntentions: [],
    pseduNominationRecords: [],
    senators: [],
    logos: {}
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
    },
    setSenators: {
      reducer(state, action) {
        state.senators = action.payload
      }
    },
    setLogos: {
      reducer(state, action) {
        state.logos = action.payload
      }
    }
  }
})

export const {
  setIntentions,
  setPseduIntentions,
  setPseduNominationRecords,
  setSenators,
  setLogos
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

export const fetchSenators = () => async dispatch => {
  const resp = await window.fetch('https://api.chainx.org/congress/members')
  const senators = await resp.json()
  dispatch(setSenators(senators))
}

export const fetchLogos = () => async dispatch => {
  const resp = await window.fetch('https://api.chainx.org/intention_logos')
  const logos = await resp.json()
  dispatch(
    setLogos(
      logos.reduce((result, logo) => {
        return {
          ...result,
          ...logo
        }
      }, {})
    )
  )
}

export const intentionsSelector = state => {
  return state.intentions.intentions
}

export const senatorsSelector = state => {
  return state.intentions.senators
}

export const logosSelector = state => state.intentions.logos

export const normalizedIntentionsSelector = createSelector(
  intentionsSelector,
  senatorsSelector,
  logosSelector,
  (intentions, senators, logos = {}) => {
    return intentions.map(intention => {
      let isSenator = false
      if (senators.find(senator => senator === intention.name)) {
        isSenator = true
      }

      let hasLogo = false
      const logo = logos[intention.name.toLowerCase()]
      if (logos[intention.name.toLowerCase()]) {
        hasLogo = true
      }

      const result = {
        ...intention,
        isSenator,
        hasLogo
      }

      if (hasLogo) {
        Object.assign(result, { logo })
      }

      return result
    })
  }
)

export default intentionSlice.reducer

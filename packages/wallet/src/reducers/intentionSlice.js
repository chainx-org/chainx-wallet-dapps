import { createSlice, createSelector } from 'redux-starter-kit'
import { getChainx } from '../services/chainx'
import { getApi } from '../services/api'

const intentionSlice = createSlice({
  slice: 'intentions',
  initialState: {
    intentions: [],
    pseduIntentions: [],
    pseduNominationRecords: [],
    senators: [],
    logos: {},
    nominationRecords: []
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
    },
    setNominationRecords: {
      reducer(state, action) {
        state.nominationRecords = action.payload
      }
    }
  }
})

export const {
  setIntentions,
  setPseduIntentions,
  setPseduNominationRecords,
  setSenators,
  setLogos,
  setNominationRecords
} = intentionSlice.actions

async function getStake() {
  const chainx = getChainx()
  await chainx.isRpcReady()
  const { stake } = chainx

  return stake
}

export const fetchIntentions = () => async dispatch => {
  const stake = await getStake()

  const resp = await stake.getIntentions()
  resp.sort((a, b) => {
    if (b.isActive && !a.isActive) {
      return 1
    } else if (!b.isActive && a.isActive) {
      return -1
    }

    if (a.selfVote !== b.selfVote) {
      return b.selfVote - a.selfVote
    }

    return b.totalNomination - a.totalNomination
  })
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
  const resp = await window.fetch(`${getApi()}congress/members`)
  const senators = await resp.json()
  dispatch(setSenators(senators))
}

export const fetchLogos = () => async dispatch => {
  const resp = await window.fetch(`${getApi()}intention_logos`)
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

export const fetchNominationRecords = address => async dispatch => {
  const stake = await getStake()

  const records = await stake.getNominationRecordsV1(address)
  const normalized = records.map(record => {
    const intention = record[0]
    const info = record[1]
    return { intention, info }
  })
  dispatch(setNominationRecords(normalized))
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

export const activeIntentionsSelector = createSelector(
  normalizedIntentionsSelector,
  intentions => {
    return intentions.filter(intention => intention.isActive)
  }
)

export const nominationRecordsSelector = state =>
  state.intentions.nominationRecords

export default intentionSlice.reducer

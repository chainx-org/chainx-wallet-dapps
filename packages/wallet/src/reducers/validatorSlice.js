import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../services/chainx'
import { setLoadingIntentions } from '@reducers/runStatusSlice'
import chunk from 'lodash.chunk'

const validatorSlice = createSlice({
  name: 'validators',
  initialState: {
    validators: [],
    nominationInfo: {}
  },
  reducers: {
    setValidators(state, { payload }) {
      state.validators = payload
    },
    setNominationInfo(state, { payload }) {
      state.nominationInfo = payload
    }
  }
})

export const { setValidators, setNominationInfo } = validatorSlice.actions

export const fetchAccountNominations = address => async dispatch => {
  const api = getChainx()
  const nominationMap = await api.rpc.xstaking.getNominationByAccount(address)

  console.log('nominationMap', nominationMap.toJSON())
  dispatch(setNominationInfo(nominationMap.toJSON()))
}

export const fetchAccountNominationInterest = address => async dispatch => {
  const api = getChainx()
  const interestMap = await api.rpc.xstaking.getDividendByAccount(address)

  console.log('interestMap', interestMap.toJSON())
}

export const fetchValidators = (setLoading = false) => async dispatch => {
  if (setLoading) {
    dispatch(setLoadingIntentions(true))
  }

  try {
    const api = getChainx()
    const validators = await api.rpc.xstaking.getValidators()

    dispatch(setValidators(validators.toJSON()))
  } finally {
    dispatch(setLoadingIntentions(false))
  }
}

export const validatorsSelector = state => state.validator.validators
export const validatorChunksSelector = createSelector(
  validatorsSelector,
  validators => {
    return chunk(validators, 4)
  }
)

export const nominationInfoSelector = state => state.validator.nominationInfo
export const totalNominationSelector = createSelector(
  nominationInfoSelector,
  info => {
    return Object.entries(info).reduce((result, [_, { nomination }]) => {
      return result + nomination
    }, 0)
  }
)

export default validatorSlice.reducer

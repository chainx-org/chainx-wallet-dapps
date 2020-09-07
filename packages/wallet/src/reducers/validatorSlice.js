import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx, getChainxPromised } from '../services/chainx'
import { setLoadingIntentions } from '@reducers/runStatusSlice'
import chunk from 'lodash.chunk'
import BigNumber from 'bignumber.js'

const validatorSlice = createSlice({
  name: 'validators',
  initialState: {
    validators: [],
    nominationInfo: {},
    interestInfo: {},
    nominatorInfo: {
      lastRebond: null,
      unbondedChunks: []
    },
    bondingDuration: null
  },
  reducers: {
    setValidators(state, { payload }) {
      state.validators = payload
    },
    setNominationInfo(state, { payload }) {
      state.nominationInfo = payload
    },
    setInterestInfo(state, { payload }) {
      state.interestInfo = payload
    },
    setNominatorInfo(state, { payload }) {
      state.nominatorInfo = payload
    },
    setBondingDuration(state, { payload }) {
      state.bondingDuration = payload
    }
  }
})

export const {
  setValidators,
  setNominationInfo,
  setInterestInfo,
  setNominatorInfo,
  setBondingDuration
} = validatorSlice.actions

export const fetchBondingDuration = () => async dispatch => {
  const api = await getChainxPromised()
  const duration = await api.query.xStaking.bondingDuration()
  dispatch(setBondingDuration(duration.toNumber()))
}

export const fetchNominatorInfo = address => async dispatch => {
  const api = getChainx()
  const nominator = await api.rpc.xstaking.getNominatorByAccount(address)
  dispatch(setNominatorInfo(nominator.toJSON()))
}

export const fetchAccountNominations = address => async dispatch => {
  const api = getChainx()
  const nominationMap = await api.rpc.xstaking.getNominationByAccount(address)

  dispatch(setNominationInfo(nominationMap.toJSON()))
}

export const fetchAccountNominationInterest = (
  address,
  setLoading = false
) => async dispatch => {
  if (setLoading) {
    dispatch(setLoadingIntentions(true))
  }

  try {
    const api = getChainx()
    const interestMap = await api.rpc.xstaking.getDividendByAccount(address)

    dispatch(setInterestInfo(interestMap.toJSON()))
  } finally {
    if (setLoading) {
      dispatch(setLoadingIntentions(false))
    }
  }
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
    if (setLoading) {
      dispatch(setLoadingIntentions(false))
    }
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

export const interestInfoSelector = state => state.validator.interestInfo
export const totalInterestSelector = createSelector(
  interestInfoSelector,
  info => {
    return Object.values(info).reduce((result, value) => {
      return new BigNumber(result).plus(value).toString()
    }, 0)
  }
)

export const nominationRecordsSelector = createSelector(
  nominationInfoSelector,
  validatorsSelector,
  interestInfoSelector,
  (nomination, validators, interestMap) => {
    return Object.entries(nomination).reduce(
      (result, [address, nomination]) => {
        const validator = validators.find(v => v.account === address)
        const interest = interestMap[address]

        if (nomination && validator && interest) {
          result.push({
            account: address,
            nomination,
            validator,
            interest
          })
        }

        return result
      },
      []
    )
  }
)

export const nominatorInfoSelector = state => state.validator.nominatorInfo
export const bondingDurationSelector = state => state.validator.bondingDuration

export default validatorSlice.reducer

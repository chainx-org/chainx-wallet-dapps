import { createSelector } from '@reduxjs/toolkit'
import {
  bondingDurationSelector,
  intentionBondingDurationSelector
} from '../../../reducers/intentionSlice'
import { blockDuration } from '../../../utils/constants'
import { accountIdSelector } from '../../../reducers/addressSlice'
import { unNominationDataSelector } from '../../../reducers/runStatusSlice'

const oneDaySeconds = 60 * 60 * 24 * 1000

function calcBondingDays(blockNums) {
  if (!blockNums) {
    return null
  }

  const seconds = blockNums * blockDuration
  return (seconds / oneDaySeconds).toFixed(0)
}

export const intentionBondingDaysSelector = createSelector(
  intentionBondingDurationSelector,
  calcBondingDays
)
export const bondingDaysSelector = createSelector(
  bondingDurationSelector,
  calcBondingDays
)

export const isUnNominationFromSelfIntention = createSelector(
  accountIdSelector,
  unNominationDataSelector,
  (accountId, { intention: { account: intentionAccountId } = {} }) => {
    return accountId === intentionAccountId
  }
)

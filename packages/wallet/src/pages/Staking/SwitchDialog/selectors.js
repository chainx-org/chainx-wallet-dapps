import { createSelector } from '@reduxjs/toolkit'
import { headSelector } from '../../../reducers/chainSlice'
import moment from 'moment'
import { timeFormat } from '../../../utils/constants'
import {
  bondingDurationSelector,
  nominatorInfoSelector
} from '@reducers/validatorSlice'

const lastRebondSelector = createSelector(
  nominatorInfoSelector,
  info => info.lastRebond
)

export const reachNexRenominateSelector = createSelector(
  headSelector,
  bondingDurationSelector,
  lastRebondSelector,
  (head, duration, lastRebond) => {
    if (!lastRebond) {
      return true
    }

    if (!head || !duration) {
      return false
    }

    return head >= lastRebond + duration
  }
)

export const nextRenominateHeightSelector = createSelector(
  lastRebondSelector,
  bondingDurationSelector,
  (lastRebond, duration) => {
    if (!lastRebond || !duration) {
      return null
    }

    return lastRebond + duration
  }
)

export const nextRenominateTimeSelector = createSelector(
  headSelector,
  nextRenominateHeightSelector,
  (head, nextRenominateHeight) => {
    if (!nextRenominateHeight || !head || nextRenominateHeight <= head) {
      return moment().format(timeFormat)
    }

    const time = (nextRenominateHeight - head) * 6000 + moment.now()
    return moment(time).format(timeFormat)
  }
)

import { createSelector } from '@reduxjs/toolkit'
import { headSelector } from '../../../reducers/chainSlice'
import { nextRenominateHeightSelector } from '../../../reducers/intentionSlice'
import moment from 'moment'
import { timeFormat } from '../../../utils/constants'

export const reachNexRenominateSelector = createSelector(
  headSelector,
  nextRenominateHeightSelector,
  (head, nextRenominateHeight) => {
    return !nextRenominateHeight || !head || nextRenominateHeight <= head.number
  }
)

export const nextRenominateTimeSelector = createSelector(
  headSelector,
  nextRenominateHeightSelector,
  (head, nextRenominateHeight) => {
    if (!nextRenominateHeight || !head || nextRenominateHeight <= head.number) {
      return moment().format(timeFormat)
    }

    const time = (nextRenominateHeight - head.number) * 2 + head.now
    return moment(time * 1000).format(timeFormat)
  }
)

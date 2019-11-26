import { createSelector } from '@reduxjs/toolkit'
import { intentionsSelector } from '../../reducers/intentionSlice'
import { pcxPrecisionSelector } from '../selectors/assets'
import { toPrecision } from '../../utils'
import { blockNumberSelector } from '../../reducers/chainSlice'

export const totalNominationSelector = createSelector(
  intentionsSelector,
  intentions => {
    if (intentions.length <= 0) {
      return null
    }

    return intentions.reduce((result, intention) => {
      return result + intention.totalNomination
    }, 0)
  }
)

const totalIssuanceSelector = createSelector(
  blockNumberSelector,
  pcxPrecisionSelector,
  (blockNumber, precision) => {
    if (!blockNumber) {
      return null
    }

    return (Math.floor(blockNumber / 150) + 1) * 50 * Math.pow(10, precision)
  }
)

export const nominationRateSelector = createSelector(
  totalNominationSelector,
  totalIssuanceSelector,
  (nomination, issuance) => {
    if (!nomination || !issuance) {
      return null
    }

    return ((nomination / issuance) * 100).toFixed(2) + '%'
  }
)

export const normalizedTotalNominationSelector = createSelector(
  totalNominationSelector,
  pcxPrecisionSelector,
  (total, precision) => {
    if (!total || !precision) {
      return null
    }

    return toPrecision(total, precision)
  }
)

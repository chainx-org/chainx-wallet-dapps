import { createSelector } from '@reduxjs/toolkit'
import {
  intentionsSelector,
  nominationRecordsSelector,
  recordsLoadedSelector
} from '../../../../reducers/intentionSlice'
import { pcxPrecisionSelector } from '../../../selectors/assets'
import { toPrecision } from '../../../../utils'
import { blockNumberSelector } from '../../../../reducers/chainSlice'
import { calcIntentionInterest } from '../../../CrossChainMining/common'

export const totalNominationBalanceSelector = createSelector(
  nominationRecordsSelector,
  pcxPrecisionSelector,
  (records, precision) => {
    const total = records.reduce((result, record) => {
      return result + record.info.nomination
    }, 0)

    return toPrecision(total, precision)
  }
)

export const totalRevocationBalanceSelector = createSelector(
  nominationRecordsSelector,
  pcxPrecisionSelector,
  (records, precision) => {
    const total = records.reduce((result, record) => {
      const intentionRevocation = record.info.revocations.reduce(
        (result, revocation) => result + revocation.value,
        0
      )
      return result + intentionRevocation
    }, 0)

    return toPrecision(total, precision)
  }
)

export const totalInterestSelector = createSelector(
  nominationRecordsSelector,
  intentionsSelector,
  blockNumberSelector,
  pcxPrecisionSelector,
  (records, intentions, blockNumber, precision) => {
    if (blockNumber === null) {
      return toPrecision(0, precision)
    }

    const total = records.reduce((result, record) => {
      const interest = calcIntentionInterest(record, intentions, blockNumber)
      return result + interest
    }, 0)

    return toPrecision(total, precision)
  }
)

export const interestLoadingSelector = createSelector(
  blockNumberSelector,
  intentionsSelector,
  recordsLoadedSelector,
  (blockNumber, intentions, loaded) => {
    return null === blockNumber || intentions.length <= 0 || !loaded
  }
)

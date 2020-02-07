import { createSelector } from '@reduxjs/toolkit'
import {
  nominationRecordsSelector,
  normalizedIntentionsSelector
} from '../../../../../reducers/intentionSlice'
import { blockNumberSelector } from '../../../../../reducers/chainSlice'
import { calcInterest } from '../../../../CrossChainMining/common'

export const detailedRecordsSelector = createSelector(
  nominationRecordsSelector,
  normalizedIntentionsSelector,
  blockNumberSelector,
  (records, intentions, blockNumber) => {
    return records
      .map(record => {
        const intention = intentions.find(
          intention => intention.account === record.intention
        )

        const interest = calcInterest(record, intention, blockNumber)

        return {
          ...record,
          intention,
          interest
        }
      })
      .filter(record => {
        return record.info.nomination > 0 || record.interest > 0
      })
  }
)

export const sortedRecordsSelector = createSelector(
  detailedRecordsSelector,
  records => {
    return [...records].sort((a, b) => b.info.nomination - a.info.nomination)
  }
)

import { createSelector } from 'redux-starter-kit'
import {
  nominationRecordsSelector,
  normalizedIntentionsSelector
} from '../../../../../reducers/intentionSlice'
import { blockNumberSelector } from '../../../../../reducers/chainSlice'
import { calcIntentionInterest } from '../../../../CrossChainMining/common'

export const detailedRecordsSelector = createSelector(
  nominationRecordsSelector,
  normalizedIntentionsSelector,
  blockNumberSelector,
  (records, intentions, blockNumber) => {
    return records.map(record => {
      const intention = intentions.find(
        intention => intention.account === record.intention
      )

      const interest = calcIntentionInterest(record, intentions, blockNumber)

      return {
        ...record,
        intention,
        interest
      }
    })
  }
)

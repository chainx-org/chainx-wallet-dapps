import { createSelector } from 'redux-starter-kit'
import {
  nominationRecordsSelector,
  normalizedIntentionsSelector
} from '../../../../../reducers/intentionSlice'

export const detailedRecordsSelector = createSelector(
  nominationRecordsSelector,
  normalizedIntentionsSelector,
  (records, intentions) => {
    return records.map(record => {
      const intention = intentions.find(
        intention => intention.account === record.intention
      )
      return {
        ...record,
        intention
      }
    })
  }
)

import { createSelector } from 'redux-starter-kit'
import {
  pseduNominationRecordsSelector,
  sdotIntentionSelector
} from '../selectors'
import { token } from '../../../utils/constants'
import { blockNumberSelector } from '../../../reducers/chainSlice'
import { calcInterest } from '../common'

const sdotRecordSelector = createSelector(
  pseduNominationRecordsSelector,
  records => {
    return records.find(record => (record.id = token.SDOT))
  }
)

export const sdotInterestSelector = createSelector(
  blockNumberSelector,
  sdotIntentionSelector,
  sdotRecordSelector,
  calcInterest
)

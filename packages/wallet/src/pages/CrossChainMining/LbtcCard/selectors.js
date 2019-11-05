import { createSelector } from 'redux-starter-kit'
import {
  lbtcIntentionSelector,
  pseduNominationRecordsSelector
} from '../selectors'
import { token } from '../../../utils/constants'
import { blockNumberSelector } from '../../../reducers/chainSlice'
import { calcInterest } from '../common'

const lbtcRecordSelector = createSelector(
  pseduNominationRecordsSelector,
  records => {
    return records.find(record => record.id === token.LBTC)
  }
)

export const lbtcInterestSelector = createSelector(
  blockNumberSelector,
  lbtcIntentionSelector,
  lbtcRecordSelector,
  calcInterest
)

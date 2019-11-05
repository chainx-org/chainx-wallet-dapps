import { createSelector } from 'redux-starter-kit'
import { token } from '../../../utils/constants'
import {
  pseduNominationRecordsSelector,
  xbtcIntentionSelector
} from '../selectors'
import { blockNumberSelector } from '../../../reducers/chainSlice'
import { calcInterest } from '../common'

const xbtcRecordSelector = createSelector(
  pseduNominationRecordsSelector,
  records => {
    return records.find(record => record.id === token.XBTC)
  }
)

export const xbtcInterestSelector = createSelector(
  blockNumberSelector,
  xbtcIntentionSelector,
  xbtcRecordSelector,
  calcInterest
)
